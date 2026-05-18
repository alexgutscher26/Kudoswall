/**
 * Utility for scanning uploaded files against VirusTotal using their SHA-256 hash.
 */

export interface VirusScanResult {
  status: "clean" | "infected" | "error" | "skipped";
  hash: string;
}

/**
 * Computes the SHA-256 hash of an ArrayBuffer.
 */
export async function computeSha256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Checks a file buffer against VirusTotal by its SHA-256 hash.
 * This is a fast, synchronous lookup that doesn't require uploading the actual file.
 * Returns 'clean' if the file is unknown to VT or has 0 malicious detections.
 *
 * @param buffer - The file contents to scan
 * @param apiKey - The VirusTotal API key (can be undefined to skip)
 */
export async function scanFileHash(
  buffer: ArrayBuffer,
  apiKey: string | undefined,
): Promise<VirusScanResult> {
  const hash = await computeSha256(buffer);

  if (!apiKey) {
    return { status: "skipped", hash };
  }

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
      method: "GET",
      headers: {
        "x-apikey": apiKey,
        Accept: "application/json",
      },
      // Edge compatible cache options
      cf: { cacheTtl: 300, cacheEverything: true },
    });

    if (res.status === 404) {
      // File hash is completely unknown to VirusTotal — we assume it's clean (new file)
      return { status: "clean", hash };
    }

    if (!res.ok) {
      console.warn(`[VirusTotal] API Error ${res.status}: ${await res.text()}`);
      return { status: "error", hash };
    }

    const data = (await res.json()) as any;
    const maliciousCount = data?.data?.attributes?.last_analysis_stats?.malicious ?? 0;

    if (maliciousCount > 0) {
      return { status: "infected", hash };
    }

    return { status: "clean", hash };
  } catch (error) {
    console.error("[VirusTotal] Network or parsing error:", error);
    return { status: "error", hash };
  }
}
