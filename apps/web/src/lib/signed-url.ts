/**
 * HMAC-SHA256 signed URL utilities for private R2 asset access.
 *
 * Tokens are embedded as query params:
 *   /api/videos/{key}?token=<base64url>&exp=<unix-timestamp>
 *
 * The secret is `R2_SIGNING_SECRET` from the Cloudflare Worker env.
 * Default TTL: 3600 seconds (1 hour).
 */

const ALGORITHM = { name: "HMAC", hash: "SHA-256" };

function base64urlEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(secret), ALGORITHM, false, ["sign", "verify"]);
}

/**
 * Signs a payload string with HMAC-SHA256 using the provided secret.
 */
async function sign(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign(ALGORITHM.name, key, enc.encode(payload));
  return base64urlEncode(sig);
}

/**
 * Generates a signed URL path for a private R2 asset.
 *
 * @param key        - The R2 object key (e.g. "vid_abc123.webm")
 * @param secret     - The `R2_SIGNING_SECRET` env var value
 * @param ttlSeconds - Token lifetime in seconds (default: 3600)
 * @returns Relative URL string with `token` and `exp` query params
 */
export async function generateSignedUrl(
  key: string,
  secret: string,
  ttlSeconds = 3600,
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${key}:${exp}`;
  const token = await sign(payload, secret);
  return `/api/videos/${encodeURIComponent(key)}?token=${token}&exp=${exp}`;
}

/**
 * Verifies a signed URL token for a private R2 asset.
 * Returns false if the signature is invalid or the token has expired.
 *
 * @param key   - The R2 object key from the URL path
 * @param token - The `token` query param value
 * @param exp   - The `exp` query param value (unix timestamp string)
 * @param secret - The `R2_SIGNING_SECRET` env var value
 */
export async function verifySignedUrl(
  key: string,
  token: string,
  exp: string,
  secret: string,
): Promise<boolean> {
  const expNum = parseInt(exp, 10);
  if (isNaN(expNum)) return false;

  // Check expiry first — cheap, avoids crypto if expired
  if (Math.floor(Date.now() / 1000) > expNum) return false;

  const payload = `${key}:${exp}`;
  const expected = await sign(payload, secret);

  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}
