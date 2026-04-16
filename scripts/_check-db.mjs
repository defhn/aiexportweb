import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const lines = fs.readFileSync('.env.local', 'utf-8').split('\n');
let dbUrl = '';
for (const line of lines) {
  if (line.startsWith('DATABASE_URL')) {
    dbUrl = line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    break;
  }
}

const sql = neon(dbUrl);
const [p] = await sql`SELECT COUNT(*) as cnt FROM products`;
const [c] = await sql`SELECT COUNT(*) as cnt FROM product_categories`;
console.log('✅ 产品总数:', p.cnt);
console.log('✅ 分类总数:', c.cnt);
