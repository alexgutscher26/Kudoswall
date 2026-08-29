/**
 * High-performance set of known disposable and temporary email domains.
 * Avoids heavy runtime JSON imports in Next.js Turbopack / Edge environments.
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "sharklasers.com",
  "grr.la",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "10minutemail.net",
  "throwawaymail.com",
  "dispostable.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "trashmail.com",
  "trashmail.net",
  "trashmail.org",
  "getairmail.com",
  "meltmail.com",
  "mytemp.email",
  "fakeinbox.com",
  "maildrop.cc",
  "inboxkitten.com",
  "burnermail.io",
  "crazymailing.com",
  "generator.email",
  "tempinbox.com",
  "mohmal.com",
  "nada.ltd",
  "getnada.com",
  "emailondeck.com",
  "fakemailgenerator.com",
  "receive-sms-free.cc",
  "tempmailaddress.com",
  "minuteinbox.com",
  "disposablemail.com",
  "tmail.com",
  "tmail.io",
  "tmpmail.net",
  "tmpmail.org",
]);

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
