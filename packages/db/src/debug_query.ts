import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../apps/web/.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const sql = `
    select "testimonial"."id", "testimonial"."workspace_id", "testimonial"."project_id", "testimonial"."content", "testimonial"."rating", "testimonial"."author_name", "testimonial"."author_email", "testimonial"."author_image", "testimonial"."author_company", "testimonial"."author_linkedin", "testimonial"."author_tagline", "testimonial"."status", "testimonial"."type", "testimonial"."video_url", "testimonial"."video_transcodes_json", "testimonial"."video_processing_status", "testimonial"."virus_scan_status", "testimonial"."virus_scan_hash", "testimonial"."created_at", "testimonial"."updated_at", "testimonial"."deleted_at", "testimonial_project"."data" as "project", "testimonial_testimonialToTags"."data" as "testimonialToTags" 
    from "testimonial" "testimonial" 
    left join lateral (
      select json_build_array("testimonial_project"."id", "testimonial_project"."workspace_id", "testimonial_project"."name", "testimonial_project"."slug", "testimonial_project"."collection_slug", "testimonial_project"."description", "testimonial_project"."thank_you_message", "testimonial_project"."collection_settings_json", "testimonial_project"."active", "testimonial_project"."custom_domain", "testimonial_project"."custom_domain_verified", "testimonial_project"."custom_domain_verification_token", "testimonial_project"."custom_domain_verification_error", "testimonial_project"."created_at", "testimonial_project"."updated_at", "testimonial_project"."deleted_at") as "data" 
      from (select * from "project" "testimonial_project" where "testimonial_project"."id" = "testimonial"."project_id" limit $1) "testimonial_project"
    ) "testimonial_project" on true 
    left join lateral (
      select coalesce(json_agg(json_build_array("testimonial_testimonialToTags"."testimonial_id", "testimonial_testimonialToTags"."tag_id", "testimonial_testimonialToTags_tag"."data")), '[]'::json) as "data" 
      from "testimonial_to_tag" "testimonial_testimonialToTags" 
      left join lateral (
        select json_build_array("testimonial_testimonialToTags_tag"."id", "testimonial_testimonialToTags_tag"."workspace_id", "testimonial_testimonialToTags_tag"."name", "testimonial_testimonialToTags_tag"."color", "testimonial_testimonialToTags_tag"."created_at", "testimonial_testimonialToTags_tag"."deleted_at") as "data" 
        from (select * from "tag" "testimonial_testimonialToTags_tag" where "testimonial_testimonialToTags_tag"."id" = "testimonial_testimonialToTags"."tag_id" limit $2) "testimonial_testimonialToTags_tag"
      ) "testimonial_testimonialToTags_tag" on true 
      where "testimonial_testimonialToTags"."testimonial_id" = "testimonial"."id"
    ) "testimonial_testimonialToTags" on true 
    where ("testimonial"."project_id" in ($3) and "testimonial"."deleted_at" is null) 
    order by "testimonial"."created_at" desc limit $4
  `;

  const params = [1, 1, "9cf4ea2a-add7-4dde-84cd-69526ce3e05b", 5];

  try {
    const res = await pool.query(sql, params);
    console.log("Success!", res.rowCount, "rows found");
  } catch (err: any) {
    console.error("--- PG ERROR ---");
    console.error(err.message);
    if (err.detail) console.error("Detail:", err.detail);
    if (err.hint) console.error("Hint:", err.hint);
    if (err.where) console.error("Where:", err.where);
  }

  process.exit(0);
}

run();
