/**
 * HMAC-SHA256 signed URL utilities for private R2 asset access.
 * Duplicated in `apps/web/src/lib/signed-url.ts` for edge runtime use.
 * This copy is for use within the `packages/api` tRPC procedures (Node.js runtime).
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

async function sign(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign(ALGORITHM.name, key, enc.encode(payload));
  return base64urlEncode(sig);
}

/**
 * Generates a signed URL path for a private R2 video asset.
 *
 * @param key        - The R2 object key (e.g. "vid_abc123.webm")
 * @param secret     - The `R2_SIGNING_SECRET` env var value
 * @param ttlSeconds - Token lifetime in seconds (default: 3600)
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
