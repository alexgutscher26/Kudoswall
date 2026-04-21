# ⚡ Database Connection Pooling

This document explains how KudosWall manages database connections efficiently in a serverless environment using **Neon's Built-in Pooling**.

## 📍 Why Pooling?

Serverless functions (Cloudflare Workers, Next.js Edge) scale rapidly and can create hundreds of concurrent database connections. Traditional PostgreSQL has a fixed limit on connections (e.g., 100). 

**Connection Pooling** (via PgBouncer) acts as a middleman that:
- Keeps a pool of "warm" connections to the database.
- Assigns connections to requests on-demand.
- Releases connections immediately after a transaction completes.

## 🚀 Neon Pooling (Recommended)

KudosWall is built for **Neon**, which includes a high-performance PgBouncer pooler out-of-the-box.

### 1. The Pooled Connection URL
To enable pooling, you must use the pooled connection string in your environment variables. 

- **Direct URL**: `postgres://user:pass@ep-cool-name.region.neon.tech/neondb`
- **Pooled URL**: `postgres://user:pass@ep-cool-name-pooler.region.neon.tech/neondb` (Note the `-pooler` suffix).

> [!IMPORTANT]
> The Neon pooler operates in **Transaction Mode**. This is compatible with Drizzle ORM but means you cannot use PostgreSQL session-level features like `SET`, `LISTEN/NOTIFY`, or temporary tables.

### 2. Implementation in KudosWall
KudosWall uses the `@neondatabase/serverless` package which is optimized for this architecture. The initialization is handled in `packages/db/src/index.ts`.

```typescript
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const pool = new Pool({
  connectionString: env.DATABASE_URL, // Ensure this ends in -pooler.neon.tech
});

const db = drizzle({ client: pool, schema });
```

## 🛠️ Configuration Steps

1. **Get the Pooled URL**:
   - Go to your **Neon Console**.
   - In the **Connection Details** widget, toggle the **Pooling** switch.
   - Copy the new connection string.

2. **Update Environment Variables**:
   - In `apps/web/.env` and your deployment provider (Cloudflare/Alchemy):
     - `DATABASE_URL="postgres://...@...-pooler.region.neon.tech/neondb?sslmode=require"`
     - `DATABASE_READ_URL="postgres://...@...-pooler.region.neon.tech/neondb?sslmode=require"` (If using replicas)

## 🔄 Technical Trade-offs

| Feature | Direct Connection | Pooled Connection |
| :--- | :--- | :--- |
| **Max Connections** | ~100 | ~10,000+ |
| **Connection Overhead** | High (New TCP/SSL per request) | Low (Warm pool) |
| **Session State** | Supported | Not Supported (Transaction Mode) |
| **Latency** | Slightly lower for single queries | Significantly lower for concurrent load |

## 🧪 Verification
To verify that pooling is working, you can check the **Analytics** or **Operations** tab in the Neon Console. You should see connections staying stable under load rather than spiking to the limit.

---
**See Also:**
- [Neon Documentation: Connection Pooling](https://neon.tech/docs/manage/connection-pooling/)
