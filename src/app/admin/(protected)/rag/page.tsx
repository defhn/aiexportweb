import { getDb } from "@/db/client";
import { products } from "@/db/schema";
import { count, isNotNull } from "drizzle-orm";
import { Database, FileText, HelpCircle } from "lucide-react";
import { RagWorkbench } from "./_components/rag-workbench";

export const dynamic = "force-dynamic";

export default async function AdminRagPage() {
  const db = getDb();

  const [totalProducts, withDetails, withFaqs] = await Promise.all([
    db.select({ count: count() }).from(products),
    db.select({ count: count() }).from(products).where(isNotNull(products.detailsEn)),
    db.select({ count: count() }).from(products).where(isNotNull(products.faqsJson)),
  ]);

  const stats = {
    products: totalProducts[0]?.count ?? 0,
    withDetails: withDetails[0]?.count ?? 0,
    withFaqs: withFaqs[0]?.count ?? 0,
  };

  const coverageRate =
    stats.products > 0 ? Math.round((stats.withDetails / stats.products) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 閳光偓閳光偓 閺嶅洭顣介崡锟� 閳光偓閳光偓 */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">RAG 閻儴鐦戝銉ュ范</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              閸╄桨绨担鐘垫畱娴溠冩惂缁変焦婀侀惌銉ㄧ槕鎼存搫绱濋悽鐔稿灇娑撴挷绗熼惃鍕紣娑撴艾顦荤拹绋垮敶鐎圭櫢绱遍獮鑸垫箒閵嗗瓑I 娴滃鐤勯弽鍛婄叀閵嗗秴濮涢懗鏂ょ礉
              閼奉亜濮╅弽鍥╁娑撳海鐓＄拠鍡楃氨閻稓娴橀惃鍕Η閺堫垰寮弫甯礉閺夋粎绮� AI 楠炴槒顫庢稉濠勫殠閵嗭拷
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              stats.products > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stats.products > 0 ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            {stats.products > 0 ? "閻儴鐦戞惔鎾冲嚒鐏忚京鍗�" : "閻儴鐦戞惔鎾茶礋缁岋拷"}
          </span>
        </div>

        {/* 閻儴鐦戞惔鎾诡潐濡紕绮虹拋锟� */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">{stats.products}</p>
              <p className="text-xs text-stone-400">娴溠冩惂閹粯鏆�</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">{stats.withDetails}</p>
              <p className="text-xs text-stone-400">閺堝顕涢幆锟� ({coverageRate}%)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">{stats.withFaqs}</p>
              <p className="text-xs text-stone-400">閸氾拷 FAQ</p>
            </div>
          </div>
        </div>

        {stats.products > 0 && coverageRate < 50 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            閳跨媴绗� 娴狅拷 {coverageRate}% 閻ㄥ嫪楠囬崫浣规箒閼昏鲸鏋冪拠锔藉剰閿涘苯缂撶拋顔兼躬閵嗗奔楠囬崫浣侯吀閻炲棎鈧秳鑵戠悰銉ュ帠 detailsEn
            鐎涙顔岄敍宀冪箹閺勶拷 RAG 閻儴鐦戞惔鎾舵畱閺嶇ǹ绺鹃弫鐗堝祦濠ф劑鈧拷
          </div>
        )}
      </section>

      {/* 閳光偓閳光偓 瀹搞儰缍旈崣锟� 閳光偓閳光偓 */}
      <RagWorkbench />
    </div>
  );
}
