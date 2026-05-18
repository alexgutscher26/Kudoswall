# 💾 Database Backup & Restore Guide

KudosWall maintains a robust data durability strategy combining Neon's native PITR (Point-in-Time Recovery) with independent daily off-site backups.

## 📍 Automated Strategy

Our backups are managed via GitHub Actions:

- **Frequency**: Daily at 00:00 UTC.
- **Mechanism**: `pg_dump` (Custom Format `-Fc`).
- **Verification**: Every backup is automatically restored to a local Dockerized PostgreSQL instance in the CI environment to ensure integrity.
- **Storage**: Encrypted storage in **Cloudflare R2** (S3-compatible).

## 🛠️ Required Secrets

To function, the following GitHub Secrets must be configured in the repository:

| Secret Name            | Description                                                         |
| :--------------------- | :------------------------------------------------------------------ |
| `DATABASE_URL`         | Primary connection string for the production Neon DB.               |
| `R2_BUCKET_NAME`       | Name of the R2 bucket for backup storage.                           |
| `R2_ACCESS_KEY_ID`     | API Key for Cloudflare R2.                                          |
| `R2_SECRET_ACCESS_KEY` | Secret Key for Cloudflare R2.                                       |
| `R2_ENDPOINT`          | R2 S3 API Endpoint (e.g., `https://<id>.r2.cloudflarestorage.com`). |

## 🆘 Manual Restoration Procedure

If you need to restore from an external backup (rather than using [Neon PITR](database-pitr-strategy.md)):

### 1. Download the Backup

Retrieve the latest `.dump` file from the `backups/` directory in the R2 bucket.

### 2. Restore to a Local/Staging DB

```bash
# Set PGPASSWORD if needed
export PGPASSWORD='your_password'

# Create a fresh DB
createdb -h localhost -U your_user kudoswall_restore

# Restore the custom-format dump
pg_restore -h localhost -U your_user -d kudoswall_restore -v backup.dump
```

### 3. Verify Integrity

Run the internal inventory script to ensure all tables and counts match expectations:

```bash
bun --filter @my-better-t-app/db run src/inventory.ts
```

## 🧪 Restore Testing

The GitHub Action performs a "Smoking Test" by:

1. Spinning up `postgres:16`.
2. Restoring the entire dump.
3. Querying the `information_schema` to ensure all `public` tables exist.
4. If the table count is 0 or the restore fails, the workflow aborts and notifies the team.

---

**See Also:**

- [Point-in-Time Recovery (PITR) Strategy](database-pitr-strategy.md)
