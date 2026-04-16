const fs = require('fs');
const lines = fs.readFileSync('.env.local', 'utf-8').split('\n');
let dbUrl = '';
for (const line of lines) {
  if (line.startsWith('DATABASE_URL')) {
    dbUrl = line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    break;
  }
}

const { Client } = require('pg');
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000, query_timeout: 10000 });

client.connect().then(async () => {
  const p = await client.query('SELECT COUNT(*) FROM products');
  const c = await client.query('SELECT COUNT(*) FROM product_categories');
  console.log('产品总数:', p.rows[0].count);
  console.log('分类总数:', c.rows[0].count);
  await client.end();
}).catch(e => {
  console.error('连接失败:', e.message);
});
