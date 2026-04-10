"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// 鏉╂瑤閲� Hook 閻€劋绨崷銊ョ安閻€劎娈戦弽纭呭Ν閻愯濮勯崣锟� UTM 閸滃矁鎷烽煪顏勫棘閺佸府绱濋獮璺虹摠閸屻劌鍩� localStorage
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
      // 娣囨繆鐦夐張鈧弬鎵畱閸欏倹鏆熺憰鍡欐磰閺冄呮畱閿涘矂鈧艾鐖堕崣顖欎簰鐠佹儳鐣炬稉鈧稉顏呮箒閺佸牊婀�
      // 鏉╂瑩鍣风粻鈧弰鎾崇摠閸忥拷 localStorage
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

// 鏉堝懎濮弬瑙勭《閿涙俺骞忛崣鏍х秼閸撳秶娈戠紓鎾崇摠鏉╁€熼嚋閸欏倹鏆�
export function getSavedTrackingParams() {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem("tracking_params");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}
