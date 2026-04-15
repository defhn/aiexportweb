CREATE TABLE IF NOT EXISTS "site_domains" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "site_id" integer NOT NULL REFERENCES "sites"("id") ON DELETE CASCADE,
  "host" text NOT NULL,
  "kind" varchar(40) DEFAULT 'alias' NOT NULL,
  "is_primary" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "site_domains_host_unique"
  ON "site_domains" ("host");

CREATE UNIQUE INDEX IF NOT EXISTS "site_domains_site_host_unique"
  ON "site_domains" ("site_id", "host");

INSERT INTO "site_domains" ("site_id", "host", "kind", "is_primary")
SELECT "id", lower(regexp_replace("domain", ':\d+$', '')), 'primary', true
FROM "sites"
WHERE "domain" IS NOT NULL AND trim("domain") <> ''
ON CONFLICT ("host") DO NOTHING;
