/**
 * 数据库补丁脚本：幂等运行，安全支持重复执行。
 * 所有操作均使用 IF NOT EXISTS / DO NOTHING 保障幂等性，不会因重复执行而报错。
 */
import "../env";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const sql = neon(DATABASE_URL);

async function patch() {
  console.log("开始执行数据库补丁...");

  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_roles') THEN
        CREATE TYPE "public"."admin_roles" AS ENUM('client_admin', 'employee');
      END IF;
    END $$;
  `;
  console.log("admin_roles 枚举已确认存在");

  // 2. 创建 admin_users 表（如果不存在）
  await sql`
    CREATE TABLE IF NOT EXISTS "admin_users" (
      "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "username" text NOT NULL UNIQUE,
      "password_hash" text NOT NULL,
      "role" "admin_roles" DEFAULT 'employee' NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `;
  console.log("admin_users 表已确认存在");

  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='site_settings' AND column_name='webhook_url'
      ) THEN
        ALTER TABLE "site_settings" ADD COLUMN "webhook_url" text;
      END IF;
    END $$;
  `;
  console.log("site_settings.webhook_url 字段已确认存在");

  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='site_settings' AND column_name='site_url'
      ) THEN
        ALTER TABLE "site_settings" ADD COLUMN "site_url" text;
      END IF;
    END $$;
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='site_settings' AND column_name='seo_title_template'
      ) THEN
        ALTER TABLE "site_settings" ADD COLUMN "seo_title_template" text;
      END IF;
    END $$;
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='site_settings' AND column_name='seo_og_image_media_id'
      ) THEN
        ALTER TABLE "site_settings" ADD COLUMN "seo_og_image_media_id" integer;
      END IF;
    END $$;
  `;
  console.log("site_settings SEO 相关字段已确认存在");

  console.log("\n数据库补丁执行完成。");
}

patch().catch((error) => {
  console.error("数据库补丁执行失败：", error);
  process.exitCode = 1;
});
