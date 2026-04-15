import { BlogEditorForm } from "@/components/admin/blog-editor-form";
import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { saveBlogCategory, saveBlogPost, saveBlogTag } from "@/features/blog/actions";
import { getBlogCategoryOptions, listAdminBlogTags } from "@/features/blog/queries";
import { buildAssetFolderOptions } from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";
import { getFeatureGate } from "@/features/plans/access";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

type AdminNewBlogPageProps = {
  searchParams?: Promise<{ newCategoryId?: string; newTagName?: string }>;
};

export default async function AdminNewBlogPage({ searchParams }: AdminNewBlogPageProps) {
  const params = (await searchParams) ?? {};
  const currentSite = await getCurrentSiteFromRequest();
  const gate = await getFeatureGate("blog_management", currentSite.plan, currentSite.id);

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const parsedCategoryId = Number.parseInt(params.newCategoryId ?? "", 10);
  const injectedCategoryId = Number.isFinite(parsedCategoryId) ? parsedCategoryId : null;
  const injectedTagName = params.newTagName?.trim() ?? "";
  const [categories, imageAssets, existingTags, imageFolders] = await Promise.all([
    getBlogCategoryOptions(currentSite.seedPackKey, currentSite.id),
    listMediaAssets("image"),
    listAdminBlogTags(currentSite.id),
    listAssetFolders("image").catch(() => []),
  ]);

  return (
    <BlogEditorForm
      action={saveBlogPost}
      categories={categories.map((category) => ({
        id: category.id,
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
      }))}
      description="新建博客文章内容、封面图片、分类标签与 SEO 信息，发布前可先保存为草稿。"
      existingTags={existingTags}
      heading="新建文章"
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
        categoryId: injectedCategoryId ?? categories[0]?.id ?? null,
        titleZh: "",
        titleEn: "",
        slug: "",
        excerptZh: "",
        excerptEn: "",
        contentZh: "",
        contentEn: "",
        coverMediaId: null,
        seoTitle: "",
        seoDescription: "",
        status: "draft",
        publishedAt: "",
        tags: injectedTagName ? [injectedTagName] : [],
      }}
      returnTo="/admin/blog/new"
      saveCategoryAction={saveBlogCategory}
      saveTagAction={saveBlogTag}
      submitLabel="创建文章"
    />
  );
}
