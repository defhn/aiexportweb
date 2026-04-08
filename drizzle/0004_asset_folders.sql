CREATE TABLE "asset_folders" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "asset_folders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
  "asset_type" "asset_type" NOT NULL,
  "name" text NOT NULL,
  "parent_id" integer,
  "sort_order" integer DEFAULT 100 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

--> statement-breakpoint
ALTER TABLE "asset_folders"
  ADD CONSTRAINT "asset_folders_parent_id_asset_folders_id_fk"
  FOREIGN KEY ("parent_id") REFERENCES "public"."asset_folders"("id") ON DELETE set null ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "media_assets"
  ADD COLUMN "folder_id" integer;

--> statement-breakpoint
ALTER TABLE "media_assets"
  ADD CONSTRAINT "media_assets_folder_id_asset_folders_id_fk"
  FOREIGN KEY ("folder_id") REFERENCES "public"."asset_folders"("id") ON DELETE set null ON UPDATE no action;
