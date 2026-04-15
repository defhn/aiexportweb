DO $$ BEGIN
  CREATE TYPE "site_deal_stage" AS ENUM (
    'lead',
    'proposal',
    'negotiation',
    'active_client',
    'renewal_due',
    'churn_risk'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "sites"
  ADD COLUMN IF NOT EXISTS "sales_owner" text,
  ADD COLUMN IF NOT EXISTS "renewal_date" timestamptz,
  ADD COLUMN IF NOT EXISTS "deal_stage" "site_deal_stage" DEFAULT 'lead' NOT NULL,
  ADD COLUMN IF NOT EXISTS "contract_notes" text;
