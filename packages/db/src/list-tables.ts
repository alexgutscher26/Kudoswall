import pg from "pg";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found.");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in database:");
    res.rows.forEach((row) => console.log("- " + row.table_name));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
