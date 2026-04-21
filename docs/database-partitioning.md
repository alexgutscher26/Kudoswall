# 🏗️ Database Partitioning Strategy

This document outlines the strategy for implementing **Declarative Table Partitioning** for the `testimonial` table to support high-scale growth (10M+ rows) while maintaining query performance and enabling efficient data retention.

## 📍 Why Partitioning?

As the `testimonial` table grows past 1M+ rows:
1. **Index Bloat**: Large B-tree indexes become slower and consume more RAM.
2. **Maintenance**: Deleting old data (GDPR/Retention) via `DELETE` is extremely slow and causes table bloat. `DROP TABLE` (partition) is near-instant.
3. **Query Performance**: The database can use "Partition Pruning" to skip scanning months of data that aren't relevant to a specific query.

## 📐 Partition Design

### 1. Partition Method: **Range Partitioning**
We will partition by the `created_at` column. This is the most natural fit for time-series data like testimonials.

### 2. Granularity: **Monthly**
For a target of 10M+ testimonials, monthly partitions (approx. 800k - 1M rows per partition) provide a healthy balance between partition count and partition size.

### 3. Schema Changes (Drizzle)
PostgreSQL requires that the **Primary Key** of a partitioned table includes the partition key.

```typescript
// Proposed Refactoring in packages/db/src/schema/app.ts
export const testimonial = pgTable(
  "testimonial",
  {
    id: text("id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    // ... other columns ...
  },
  (table) => [
    primaryKey({ columns: [table.id, table.createdAt] }), // Composite PK required for partitioning
    index("testimonial_created_at_idx").on(table.createdAt),
  ]
);
```

## 🚀 Migration Strategy

Converting a live table to a partitioned one requires a "Shadow Migration":
1. **Create Template**: Create the `testimonial_partitioned` table.
2. **Create Partitions**: Pre-create partitions for the next 12 months.
3. **Double Write (Optional)**: Start writing to both tables (or use a trigger).
4. **Data Migration**: Migrate chunks of data from `testimonial` to `testimonial_partitioned`.
5. **Atomic Swap**: Rename tables within a transaction.

## 🛠️ Automated Management

We recommend using **`pg_partman`** (available on Neon) or a custom background job to manage partitions:

- **Hourly/Daily Job**: Ensure the partition for the next month exists.
- **Retention Job**: Drop partitions older than the workspace's `retentionDays` setting.

### Example SQL for Partition Creation:
```sql
CREATE TABLE testimonial_y2026m04 PARTITION OF testimonial
FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
```

## 📊 Query Optimization

To benefit from partitioning, application queries should always include a `createdAt` filter when possible:

**Bad (Scans all partitions):**
```typescript
db.select().from(testimonial).where(eq(testimonial.id, id));
```

**Good (Prunes to one partition):**
```typescript
db.select().from(testimonial).where(
  and(
    eq(testimonial.id, id),
    gte(testimonial.createdAt, startOfMonth)
  )
);
```

## ✅ Performance Targets
- **Max partition size**: 5GB / 5M rows.
- **Index lookup time**: < 10ms for p95 queries.
- **Retention cleanup**: < 100ms via `DROP DETACH`.

---
**See Also:**
- [PostgreSQL Documentation: Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [Neon: How to partition tables](https://neon.tech/docs/guides/postgresql-partitioning/)
