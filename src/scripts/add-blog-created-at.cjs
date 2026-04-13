const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function run() {
  try {
    await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now() NOT NULL`;
    console.log('✓ blog_posts.created_at 添加成功');
  } catch(e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('already exists') || msg.includes('42701')) {
      console.log('✓ blog_posts.created_at 字段已存在，跳过');
    } else {
      console.error('✗ 错误:', msg);
    }
  }
}

run().catch(console.error);
