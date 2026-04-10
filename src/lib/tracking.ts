"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// 客户端 Hook，捕获并持久化 UTM / GCLID 追踪参数到 localStorage
export function useTracking() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmTerm = searchParams.get("utm_term");
    const utmContent = searchParams.get("utm_content");
    const gclid = searchParams.get("gclid");

    const trackData: Record<string, string> = {};

    if (utmSource) trackData.utm_source = utmSource;
    if (utmMedium) trackData.utm_medium = utmMedium;
    if (utmCampaign) trackData.utm_campaign = utmCampaign;
    if (utmTerm) trackData.utm_term = utmTerm;
    if (utmContent) trackData.utm_content = utmContent;
    if (gclid) trackData.gclid = gclid;

    if (Object.keys(trackData).length > 0) {
      // 新参数覆盖旧参数（同一会话内最新一次点击广告的参数生效）
      // 首次访问则直接写入 localStorage
      try {
        const existingString = localStorage.getItem("tracking_params");
        const existingData = existingString ? JSON.parse(existingString) : {};
        const combinedData = { ...existingData, ...trackData };
        localStorage.setItem("tracking_params", JSON.stringify(combinedData));
      } catch (e) {
        console.error("Failed to parse or save tracking params:", e);
      }
    }
  }, [searchParams]);
}

// 提交询盘时调用此函数读取缓存的追踪参数并附加到表单数据
export function getSavedTrackingParams() {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem("tracking_params");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}
