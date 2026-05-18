DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan') THEN
        CREATE TYPE "public"."plan" AS ENUM('free', 'plan_1', 'plan_2', 'plan_3', 'ltd');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE "public"."subscription_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'paused', 'unpaid');
    END IF;
END $$;

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "plan" text DEFAULT 'free' NOT NULL;
ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "plan" "plan" DEFAULT 'free' NOT NULL;
ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;
ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;
ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "subscription_status" "subscription_status";
ALTER TABLE "workspace" ADD COLUMN IF NOT EXISTS "notification_settings_json" text;
ALTER TABLE "workspace" DROP COLUMN IF EXISTS "is_pro";
