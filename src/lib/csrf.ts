/**
 * Server Action CSRF 闂冨弶濮㈠銉ュ徔
 *
 * Next.js Server Actions 娑撳孩绁荤憴鍫濇珤閻拷 Same-Origin 缁涙牜鏆愰柊宥呮値閿涳拷
 * - 閼奉亜濮╅幖鍝勭敨 Cookie閿涘湯ameSite=Lax 瀹告煡妯嗛弬顓℃硶缁旓拷 POST 鐢拷 Cookie閿涳拷
 * - 娴ｅ棗缍� siteUrl 瀹告煡鍘ょ純顔芥閿涘本鍨滄禒顒勵杺婢舵牕浠� Origin/Referer 閺夈儲绨宀冪槈娴ｆ粈璐熺痪鍨箒闂冩彃灏�
 *
 * 娴ｈ法鏁ら弬鐟扮础閿涙艾婀幍鈧張澶婂晸閹垮秳缍� Server Action 瀵偓婢剁鐨熼悽锟� assertSameOrigin()
 */

import { headers } from "next/headers";

/**
 * 娴狅拷 siteUrl 閹绘劕褰� origin閿涘苯顩ч弸婊勬弓闁板秶鐤嗛崚娆掔箲閸ワ拷 null閿涘牐鐑︽潻鍥崣鐠囦緤绱氶妴锟�
 * Next.js Server Actions 瀹告彃鍞寸純锟� CSRF 闂冨弶濮㈤敍鍦玜meSite=Lax + Content-Type 濡偓閺屻儻绱氶敍锟�
 * 濮濄倕鍤遍弫棰佺稊娑撴椽顤傛径鏍畱缁惧灚绻侀梼鎻掑敖鐏炲倶鈧拷
 */
async function getExpectedOrigin(): Promise<string | null> {
  // 閸斻劍鈧礁濮炴潪鎴掍簰闁灝鍘ゅ顏嗗箚娓氭繆绂�
  const { getSiteSettings } = await import("@/features/settings/queries");
  const settings = await getSiteSettings();
  if (!settings.siteUrl) return null;

  try {
    return new URL(settings.siteUrl).origin;
  } catch {
    return null;
  }
}

/**
 * Server Action CSRF 閺夈儲绨宀冪槈
 * - 娴犲懎缍� siteUrl 闁板秶鐤嗛崥搴㈠閹笛嗩攽妤犲矁鐦夐敍鍫濈暔閸忋劑妾风痪褝绱伴張顏堝帳缂冾喗妞傛稉宥夋▎閺傤叏绱�
 * - 閺嶏繝鐛� Origin 閹达拷 Referer 婢舵潙绻€妞よ灏柊宥嗘埂閺堟稓娈戝┃锟�
 * - 閹舵稑鍤� Error 娴犮儰鑵戦弬锟� Action 閹笛嗩攽
 */
export async function assertSameOrigin(): Promise<void> {
  const expectedOrigin = await getExpectedOrigin();

  // siteUrl 閺堫亪鍘ょ純顕嗙礉鐠哄疇绻冩宀冪槈閿涘牆绱戦崣锟�/閸掓繂顫愰崠鏍▉濞堝吀绗夐梼缁樻焽閿涳拷
  if (!expectedOrigin) return;

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const referer = requestHeaders.get("referer");

  // 娴兼ê鍘涢弽锟犵崣 Origin閿涘苯鍙惧▎锟� Referer
  if (origin) {
    if (origin !== expectedOrigin) {
      throw new Error(`CSRF: Invalid origin '${origin}' (expected '${expectedOrigin}')`);
    }
    return;
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (refererOrigin !== expectedOrigin) {
        throw new Error(`CSRF: Invalid referer origin '${refererOrigin}'`);
      }
      return;
    } catch {
      throw new Error("CSRF: Malformed Referer header");
    }
  }

  // 濞屸剝婀� Origin 娑旂喐鐥呴張锟� Referer閿涘苯婀悽鐔堕獓閻滎垰顣ㄩ幏鎺旂卜閿涘牓妲诲銏犱紣閸忛琚惄瀛樺复鐠囬攱鐪伴敍锟�
  if (process.env.NODE_ENV === "production") {
    throw new Error("CSRF: Missing Origin and Referer headers");
  }
}
