import type { ReactNode } from "react";

// 根 admin layout：仅透传，不挂载任何 UI
// 侧边栏和顶栏由 (protected)/layout.tsx 负责，login 页自然隔离
export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
