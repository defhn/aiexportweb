import Link from "next/link";
import { ChevronRight, Folder, FolderPlus, Home } from "lucide-react";

import type { AssetFolderNode, AssetFolderRow } from "@/features/media/folders";

type AssetFolderSidebarProps = {
  basePath: "/admin/media" | "/admin/files";
  currentFolderId: number | null;
  tree: AssetFolderNode[];
  breadcrumbs: AssetFolderRow[];
  createFolderAction: React.ReactNode;
};

function FolderBranch({
  node,
  basePath,
  currentFolderId,
  depth = 0,
}: {
  node: AssetFolderNode;
  basePath: string;
  currentFolderId: number | null;
  depth?: number;
}) {
  const active = node.id === currentFolderId;

  return (
    <div>
      <Link
        href={`${basePath}?folder=${node.id}`}
        className={[
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
          active
            ? "bg-blue-50 text-blue-700"
            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
        ].join(" ")}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <Folder className="h-4 w-4" />
        <span className="truncate">{node.name}</span>
      </Link>
      {node.children.length ? (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <FolderBranch
              key={child.id}
              node={child}
              basePath={basePath}
              currentFolderId={currentFolderId}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AssetFolderSidebar({
  basePath,
  currentFolderId,
  tree,
  breadcrumbs,
  createFolderAction,
}: AssetFolderSidebarProps) {
  return (
    <aside className="space-y-6 rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
          <FolderPlus className="h-4 w-4" />
          {"\u65b0\u5efa\u6587\u4ef6\u5939"}
        </div>
        <div className="mt-4">{createFolderAction}</div>
      </div>

      <div className="rounded-2xl bg-stone-50 p-3 text-sm">
        <div className="flex flex-wrap items-center gap-2 text-stone-500">
          <Link href={basePath} className="inline-flex items-center gap-1 hover:text-stone-900">
            <Home className="h-4 w-4" />
            {"\u6839\u76ee\u5f55"}
          </Link>
          {breadcrumbs.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              <Link href={`${basePath}?folder=${item.id}`} className="hover:text-stone-900">
                {item.name}
              </Link>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Link
          href={basePath}
          className={[
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
            currentFolderId === null
              ? "bg-blue-50 text-blue-700"
              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
          ].join(" ")}
        >
          <Folder className="h-4 w-4" />
          <span>{"\u5168\u90e8\u7d20\u6750"}</span>
        </Link>
        {tree.map((node) => (
          <FolderBranch
            key={node.id}
            basePath={basePath}
            currentFolderId={currentFolderId}
            node={node}
          />
        ))}
      </div>
    </aside>
  );
}
