import { NextResponse } from "next/server";

const BASE_URL = "https://kudoswall.org";

// Expires 1 year from the date of last update — update annually.
// RFC 9116 requires an Expires field in ISO 8601 format.
const EXPIRES = "2027-04-20T00:00:00.000Z";

const SECURITY_TXT = `Contact: mailto:security@kudoswall.org
Expires: ${EXPIRES}
Canonical: ${BASE_URL}/.well-known/security.txt
Preferred-Languages: en
Policy: ${BASE_URL}/security/responsible-disclosure
`.trim();

export function GET(): NextResponse {
  return new NextResponse(SECURITY_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Cache for 24 hours; security.txt should be reasonably fresh
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
