CREATE TABLE "feature_usage_counters" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feature_usage_counters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
  "feature_key" varchar(80) NOT NULL,
  "usage_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "feature_usage_counters_feature_key_unique" UNIQUE("feature_key")
);
