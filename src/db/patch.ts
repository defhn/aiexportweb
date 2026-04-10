/**
 * 濠⒀呭仱閸ｈ櫣鎮伴妷銈囶伈闁煎瓨纰嶅﹢浼存晬濮橆剛鏆旈柛蹇嬪妼濠€鎾箮婵犲啯鐓€濠⒀呭仜閻⊙冣枔?閻炴稏鍔嶆晶锕傚礂閵壯冪疀闁哄牆顦伴弳鐔煎箲椤旇偐姘ㄩ柨锟? * 濞达綀娉曢弫锟?IF NOT EXISTS / DO NOTHING 濞ｅ洦绻嗛惁澶愮嵁閸屾粎鎼奸柟顑秶绀夊☉鎾崇С缁变即鎯嶉弶鎴炵稁闁绘粎澧楀﹢渚€寮悧鍫濈ウ闁碉拷? */
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

  // 2. 闁告帗绋戠紓锟?admin_users 閻炴侗鐓夌槐娆愪繆閸屾稓浜☉鎾崇Т閻°劑宕烽…鎺旂
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
  console.error("闁达拷?闁轰胶澧楀畵浣规償閹鹃【澶嬬▔娴ｇ懓鈷旈悶娑樿嫰閵囨垹鎷归妷顖滅獥", error);
  process.exitCode = 1;
});
