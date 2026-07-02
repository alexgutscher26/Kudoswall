import { drizzle } from "drizzle-orm/neon-http";
import { neon } from '@neondatabase/serverless';
import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { count as dCount, eq } from "drizzle-orm";

const planEnum = pgEnum("plan", ["free", "plan_1", "plan_2", "ltd"]);
const workspace = pgTable("workspace", {
    id: text("id").primaryKey(),
    plan: planEnum("plan").default("free").notNull(),
});

const sqlConn = neon("postgresql://jules:jules@localhost/jules");
const db = drizzle(sqlConn);

async function run() {
  try {
     const query = db.select({ count: dCount() }).from(workspace).where(eq(workspace.plan, "ltd"));
     console.log(query.toSQL());
  } catch (err) {
     console.log("Error details:", err);
  }
}
run();
