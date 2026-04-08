import { notFound } from "next/navigation";

import { BlogEditorForm } from "@/components/admin/blog-editor-form";
import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { saveBlogCategory, saveBlogPost, saveBlogTag } from "@/features/blog/actions";
import { getBlogCategoryOptions, getBlogPostById, listAdminBlogTags } from "@/features/blog/queries";
import { buildAssetFolderOptions } from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";
import { getFeatureGate } from "@/features/plans/access";

type AdminBlogDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ newCategoryId?: string; newTagName?: string }>;
};

export default async function AdminBlogDetailPage({ params, searchParams }: AdminBlogDetailPageProps) {
  const gate = await getFeatureGate("blog_management");

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const { id } = await params;
  const postId = Number.parseInt(id, 10);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  const query = (await searchParams) ?? {};
  const parsedCategoryId = Number.parseInt(query.newCategoryId ?? "", 10);
  const injectedCategoryId = Number.isFinite(parsedCategoryId) ? parsedCategoryId : null;
  const injectedTagName = query.newTagName?.trim() ?? "";
  const [post, categories, imageAssets, existingTags, imageFolders] = await Promise.all([
    getBlogPostById(postId),
    getBlogCategoryOptions(),
    listMediaAssets("image"),
    listAdminBlogTags(),
    listAssetFolders("image").catch(() => []),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <BlogEditorForm
      action={saveBlogPost}
      categories={categories.map((category) => ({
        id: category.id,
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
      }))}
      description="保存后会同步更新公开博客列表、文章详情页、sitemap 和结构化数据。"
      existingTags={existingTags}
      heading="编辑文章"
      imageAssets={imageAssets.map((asset) => ({
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        folderId: asset.folderId,
        altTextZh: asset.altTextZh,
        altTextEn: asset.altTextEn,
      }))}
      imageFolders={buildAssetFolderOptions(imageFolders)}
      post={{
        ...post,
        categoryId: injectedCategoryId ?? post.categoryId,
        tags: injectedTagName && !post.tags.includes(injectedTagName) ? [...post.tags, injectedTagName] : post.tags,
      }}
      returnTo={`/admin/blog/${postId}`}
      saveCategoryAction={saveBlogCategory}
      saveTagAction={saveBlogTag}
      submitLabel="保存文章"
    />
  );
}
