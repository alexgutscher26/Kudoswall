import { db } from "./src/lib/server-db";
import { workspace, project, testimonial, analyticsEvent } from "@my-better-t-app/db/schema";
import { eq, and, count } from "drizzle-orm";

async function runBenchmark() {
  console.log("Mocking database for performance baseline...");

  // Create a minimal db simulation just to check timing of async calls
  const mockDb = {
    query: async () => {
      return new Promise((resolve) => setTimeout(() => resolve([{ value: 10 }]), 5));
    },
  };

  const start = Date.now();
  for (let i = 0; i < 50; i++) {
    await Promise.all([mockDb.query(), mockDb.query(), mockDb.query()]);
  }
  const end = Date.now();
  console.log(`Uncached Baseline time: ${end - start}ms`);
}

runBenchmark()
  .catch(console.error)
  .then(() => process.exit(0));
