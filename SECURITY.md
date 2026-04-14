# Security Policy

At **KudosWall**, we take the security of our users' data and testimonials extremely seriously. We are committed to maintaining a secure environment and protecting the privacy of our respondents and customers.

## Supported Versions

We actively provide security updates for the current major version. We recommend all users stay on the latest version to ensure they have the most recent security patches and features.

| Version | Supported          |
| ------- | ------------------ |
| v1.x    | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

If you've discovered a security vulnerability in KudosWall, we appreciate your help in disclosing it to us in a responsible manner.

**Please do not open a public issue for security vulnerabilities.**

Instead, please send an email to **security@kudoswall.org**.

### What to include:

- A clear description of the vulnerability.
- Steps to reproduce the issue (proof-of-concept scripts or screenshots are very helpful).
- The potential impact and how an attacker might exploit it.

### Our Commitment:

- We will acknowledge receipt of your report within **24-48 hours**.
- We will provide a timeline for fixing the issue.
- We will keep you updated on our progress.
- We will provide credit (if desired) in our project changelog once the issue is resolved.

## Security Architecture

KudosWall is built on a modern, secure foundation:

- **Authentication**: Powered by `Better-Auth` with support for secure sessions, MFA, and OAuth.
- **Type Safety**: End-to-end type safety with `tRPC` prevents common data-mismatch vulnerabilities.
- **Data Protection**: `Drizzle ORM` ensures all database queries are parameterized, protecting against SQL injection.
- **CSRF & XSS**: Next.js 15+ built-in protections combined with strict Content Security Policies (CSP).
- **Audit Logs**: Critical workspace actions are recorded in our audit log system for accountability.

## Disclosure Policy

We follow a 90-day coordinated disclosure policy. We ask that you do not share details of the vulnerability publicly until a fix has been released or the 90-day window has passed, whichever comes first.

---

_Thank you for helping us keep KudosWall secure!_
