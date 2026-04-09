"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// 这个 Hook 用于在应用的根节点抓取 UTM 和追踪参数，并存储到 localStorage
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
      // 保证最新的参数覆盖旧的，通常可以设定一个有效期
      // 这里简易存入 localStorage
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

// 辅助方法：获取当前的缓存追踪参数
export function getSavedTrackingParams() {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem("tracking_params");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}
