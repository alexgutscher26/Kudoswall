import pg from "pg";
import fs from "fs";

const config = {
  connectionString:
    "postgres://cc6269a67d97e74fbae57df8fedca658574b0fd5904458fd149a5c552e765bb6:sk_sMXd-r6D2GP2x_Ek4Zk6n@db.prisma.io:5432/postgres?sslmode=require",
  ssl: { rejectUnauthorized: true },
};

async function test() {
  const pool = new pg.Pool(config);
  let output = "";
  try {
    const res = await pool.query("SELECT id, workspace_id FROM widget");
    output += "Widgets: " + JSON.stringify(res.rows, null, 2) + "\n\n";

    const testimonials = await pool.query("SELECT id, status, project_id, rating FROM testimonial");
    output += "Testimonials: " + JSON.stringify(testimonials.rows, null, 2) + "\n\n";

    fs.writeFileSync("output-db.txt", output);
    console.log("Done writing to output-db.txt");
  } catch (err) {
    fs.writeFileSync("output-db.txt", "ERROR: " + (err as any).message);
    console.error("FAILED to query database:", (err as any).message);
  } finally {
    await pool.end();
  }
}

test();
