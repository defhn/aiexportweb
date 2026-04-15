CREATE TABLE IF NOT EXISTS "site_change_logs" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "site_id" integer NOT NULL REFERENCES "sites"("id") ON DELETE CASCADE,
  "actor_admin_user_id" integer REFERENCES "admin_users"("id") ON DELETE SET NULL,
  "actor_role" varchar(40) NOT NULL,
  "action_type" varchar(80) NOT NULL,
  "summary" text NOT NULL,
  "previous_value_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "next_value_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
