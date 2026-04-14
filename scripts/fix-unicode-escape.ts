/**
 * fix-unicode-escape.ts
 * 将源文件中双重转义的 \uXXXX → 解码为真正的中文字符
 * 用法: npx tsx scripts/fix-unicode-escape.ts
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import path from "path";

const SRC_ROOT = path.resolve(__dirname, "../src");

/** 递归获取所有 .ts / .tsx 文件 */
function getAllFiles(dir: string, result: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      getAllFiles(full, result);
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      result.push(full);
    }
  }
  return result;
}

/** 把字符串里所有字面 \uXXXX（即文件中存了 4 个字符 \u 后跟4位hex）解码 */
function decodeEscapes(content: string): string {
  return content.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16)),
  );
}

function main() {
  const files = getAllFiles(SRC_ROOT);
  let fixedCount = 0;

  for (const file of files) {
    const original = readFileSync(file, "utf-8");
    const fixed = decodeEscapes(original);
    if (fixed !== original) {
      writeFileSync(file, fixed, "utf-8");
      console.log(`✅ Fixed: ${path.relative(SRC_ROOT, file)}`);
      fixedCount++;
    }
  }

  console.log(`\n共修复 ${fixedCount} 个文件`);
}

main();
