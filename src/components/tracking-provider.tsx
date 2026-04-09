"use client";

import { useTracking } from "@/lib/tracking";
import { Suspense } from "react";

function TrackingInner() {
  useTracking();
  return null;
}

export function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingInner />
    </Suspense>
  );
}
