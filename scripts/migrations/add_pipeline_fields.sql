-- ============================================================
-- Phase 2: Pipeline 状态机扩展
-- 在 Neon 后台执行此 SQL
-- 扩展 inquiry_status enum，增加 contacted / quoted / won 三个阶段
-- ============================================================

-- 1. 向 inquiry_status 枚举添加新值（Postgres 支持 IF NOT EXISTS 从 v12 起）
ALTER TYPE inquiry_status ADD VALUE IF NOT EXISTS 'contacted';
ALTER TYPE inquiry_status ADD VALUE IF NOT EXISTS 'quoted';
ALTER TYPE inquiry_status ADD VALUE IF NOT EXISTS 'won';

-- 2. 添加 Pipeline 相关辅助字段到 inquiries 表
ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS pipeline_stage text DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS expected_value numeric(12, 2),
  ADD COLUMN IF NOT EXISTS last_contact_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS won_at timestamptz;

-- 3. 验证
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inquiries' 
  AND column_name IN ('pipeline_stage','expected_value','last_contact_at','next_follow_up_at','won_at');
