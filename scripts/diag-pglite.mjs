import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";

const db = new PGlite();
const try_ = async (label, sql) => {
  try {
    await db.exec(sql);
    console.log(`ok    ${label}`);
    return true;
  } catch (e) {
    console.log(`FAIL  ${label}\n      ${String(e.message ?? e).split("\n")[0]}`);
    return false;
  }
};

await try_("create role anon", "create role anon nologin;");
await try_("create role authenticated", "create role authenticated nologin;");
await try_("create role service_role", "create role service_role nologin bypassrls;");
await try_("grant usage", "grant usage on schema public to anon, authenticated, service_role;");
await try_("pgcrypto", "create extension if not exists pgcrypto;");
await try_("gen_random_uuid", "select gen_random_uuid();");
await try_("set role", "set role anon;");
await try_("reset role", "reset role;");

// now the migration, statement by statement on failure
const sql = fs.readFileSync("supabase/migrations/0001_estimates_and_leads.sql", "utf8");
try {
  await db.exec(sql);
  console.log("\nmigration applied cleanly");
} catch (e) {
  console.log("\nmigration failed:\n  " + String(e.message ?? e).split("\n").slice(0, 6).join("\n  "));
}
await db.close();
