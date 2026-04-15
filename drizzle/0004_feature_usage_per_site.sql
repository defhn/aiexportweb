ALTER TABLE "feature_usage_counters"
  DROP CONSTRAINT IF EXISTS "feature_usage_counters_feature_key_unique";

CREATE UNIQUE INDEX IF NOT EXISTS "feature_usage_counters_site_feature_unique"
  ON "feature_usage_counters" (COALESCE("site_id", 0), "feature_key");
