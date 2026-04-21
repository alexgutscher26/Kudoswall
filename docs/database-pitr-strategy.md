# 🛡️ Database Point-in-Time Recovery (PITR) Strategy

This document outlines the strategy and procedures for recovering the KudosWall database to a specific historical state.

## 📍 Overview

KudosWall uses **Neon PostgreSQL** as its primary database provider. Neon's storage engine is inherently versioned, meaning it keeps a history of all changes (WAL - Write-Ahead Log) for a specific retention period. 

Point-in-Time Recovery (PITR) allows us to "rewind" the database and create a new branch from any specific timestamp or [LSN](https://www.postgresql.org/docs/current/datatype-pg-lsn.html) within the retention window.

## 🕒 Retention Policy

The availability of historical data depends on our current Neon plan:

| Environment | Plan | Retention Window |
| :--- | :--- | :--- |
| **Development** | Free / Starter | 24 Hours |
| **Staging** | Pro | 7 Days |
| **Production** | Business / Enterprise | 30 Days (Configurable) |

> [!IMPORTANT]
> If a disaster (e.g., accidental `DROP TABLE`) is discovered outside of this window, data cannot be recovered via PITR and must rely on the **Daily Automated Backups** (if configured).

## 🆘 When to use PITR

- **Accidental Deletion**: Recovering data after a human error (e.g., a `DELETE` query without a proper `WHERE` clause).
- **Faulty Migrations**: If a `drizzle-kit push` or `migrate` command causes data loss or corruption that cannot be easily rolled back.
- **Security Incident**: Restoring data to a state before a malicious breach or unauthorized modification.
- **Debugging**: Inspecting the state of the database at a specific time to investigate a bug report.

## 🛠️ Restoration Procedure

### 1. Identify the Target Point
Determine the exact date and time (UTC) of the incident. You want to restore to a point **just before** the failure occurred.

### 2. Create a Recovery Branch
Recovery in Neon is performed by creating a **branch**. This does not impact the current production database.

**Via Neon Console:**
1. Navigate to the **Branches** tab.
2. Click **New Branch**.
3. Select the **Parent Branch** (usually `main`).
4. Select **Point in time**.
5. Input the target **Timestamp** or **LSN**.
6. Click **Create Branch**.

**Via Neon CLI:**
```bash
neon branch create \
  --name recovery_2026_04_21 \
  --parent-id [main_branch_id] \
  --at-timestamp "2026-04-21T01:50:00Z"
```

### 3. Verification
1. Obtain the connection string for the new `recovery_...` branch.
2. Use a database client (e.g., DBeaver, `psql`, or Drizzle Studio) to connect to the recovery branch.
3. Verify that the missing/corrupted data is present and correct.

### 4. Promotion / Cutover
Once the data is verified, you have two options:

#### Option A: Switch Connection (High Speed)
Update the `DATABASE_URL` in the application environment (Cloudflare/Vercel) to point to the new branch. This is the fastest way to return to a working state.
1. Update `DATABASE_URL` in the provider's dashboard.
2. Trigger a redeploy if necessary.

#### Option B: Data Export/Import (Low Risk)
If only a specific subset of data was lost (e.g., one user's testimonials), export that data from the recovery branch and import it back into the production `main` branch.

## 🧪 Disaster Recovery Testing

To ensure our team is ready, we perform a "Recovery Drill" once every quarter:
1. Create a dummy table `recovery_test`.
2. Delete the table.
3. Follow the steps above to restore to the point before deletion.
4. Document the "Time to Recovery" (TTR) and any friction encountered.

## 📚 References
- [Neon Documentation: Branching](https://neon.tech/docs/introduction/branching/)
- [Neon Documentation: Point-in-time recovery](https://neon.tech/docs/guides/point-in-time-recovery/)
