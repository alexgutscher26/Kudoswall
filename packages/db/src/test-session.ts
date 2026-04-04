import pg from "pg";

const config = {
  connectionString:
    "postgres://cc6269a67d97e74fbae57df8fedca658574b0fd5904458fd149a5c552e765bb6:sk_sMXd-r6D2GP2x_Ek4Zk6n@db.prisma.io:5432/postgres?sslmode=require",
  ssl: { rejectUnauthorized: false },
};

async function test() {
  const pool = new pg.Pool(config);
  try {
    const res = await pool.query('SELECT 1 FROM "session" LIMIT 1;');
    console.log("SELECT 1 from 'session' success!");
  } catch (err) {
    console.error("SELECT 1 from 'session' FAILED:", (err as any).message);
  } finally {
    await pool.end();
  }
}

test();
