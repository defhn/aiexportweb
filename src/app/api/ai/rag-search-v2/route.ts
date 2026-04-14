/**
 * /api/ai/rag-search-v2
 * 
 * 此路由已与 /api/ai/rag-search 合并，统一使用 rag-utils 库。
 * 为保持向后兼容，直接 re-export v1 的实现。
 */
export { POST } from "@/app/api/ai/rag-search/route";
export const runtime = "nodejs";
