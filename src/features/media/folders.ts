export type AssetFolderRow = {
  id: number;
  assetType: "image" | "file";
  name: string;
  parentId: number | null;
  sortOrder: number;
};

export type AssetFolderNode = AssetFolderRow & {
  children: AssetFolderNode[];
};

export type AssetFolderOption = {
  id: number;
  label: string;
  depth: number;
};

function trimValue(value?: string | null) {
  return value?.trim() ?? "";
}

function toOptionalId(value?: number | null) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

function toSortOrder(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value : 100;
}

export function buildAssetFolderDraft(input: {
  id?: number | null;
  assetType: "image" | "file";
  name: string;
  parentId?: number | null;
  sortOrder?: number | null;
}) {
  return {
    id: toOptionalId(input.id),
    assetType: input.assetType,
    name: trimValue(input.name),
    parentId: toOptionalId(input.parentId),
    sortOrder: toSortOrder(input.sortOrder),
  };
}

export function buildAssetFolderTree(rows: AssetFolderRow[]) {
  const nodes = new Map<number, AssetFolderNode>();

  for (const row of rows) {
    nodes.set(row.id, { ...row, children: [] });
  }

  const roots: AssetFolderNode[] = [];

  for (const row of rows) {
    const node = nodes.get(row.id);

    if (!node) {
      continue;
    }

    if (row.parentId && nodes.has(row.parentId)) {
      nodes.get(row.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortTree = (items: AssetFolderNode[]) => {
    items.sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id);
    for (const item of items) {
      sortTree(item.children);
    }
  };

  sortTree(roots);

  return roots;
}

export function buildAssetFolderBreadcrumbs(rows: AssetFolderRow[], folderId?: number | null) {
  const folderMap = new Map(rows.map((row) => [row.id, row]));
  const breadcrumbs: AssetFolderRow[] = [];
  let cursor = toOptionalId(folderId);

  while (cursor) {
    const row = folderMap.get(cursor);

    if (!row) {
      break;
    }

    breadcrumbs.unshift(row);
    cursor = row.parentId;
  }

  return breadcrumbs;
}

export function buildAssetFolderOptions(rows: AssetFolderRow[]) {
  const tree = buildAssetFolderTree(rows);
  const options: AssetFolderOption[] = [];

  const visit = (nodes: AssetFolderNode[], depth: number) => {
    for (const node of nodes) {
      options.push({
        id: node.id,
        depth,
        label: `${"銆€".repeat(depth)}${depth > 0 ? "鈹?" : ""}${node.name}`,
      });
      visit(node.children, depth + 1);
    }
  };

  visit(tree, 0);

  return options;
}

export function collectAssetFolderIds(rows: AssetFolderRow[], folderId?: number | null) {
  const selectedId = toOptionalId(folderId);

  if (!selectedId) {
    return [];
  }

  const childrenByParent = new Map<number | null, AssetFolderRow[]>();

  for (const row of rows) {
    const siblings = childrenByParent.get(row.parentId) ?? [];
    siblings.push(row);
    childrenByParent.set(row.parentId, siblings);
  }

  const result: number[] = [];
  const stack = [selectedId];

  while (stack.length) {
    const currentId = stack.pop();

    if (!currentId || result.includes(currentId)) {
      continue;
    }

    result.push(currentId);

    for (const child of childrenByParent.get(currentId) ?? []) {
      stack.push(child.id);
    }
  }

  return result;
}
