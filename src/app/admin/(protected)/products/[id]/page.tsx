import { getAllProducts } from "@/features/products/queries";

type AdminProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailPageProps) {
  const { id } = await params;
  const products = await getAllProducts();
  const product = products[Number(id) - 1] ?? products[0];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">编辑产品</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          这里会逐步承接默认参数、自定义参数、PDF 绑定和 SEO 字段编辑。
        </p>
      </section>

      <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-stone-950">{product.nameZh}</h3>
        <p className="mt-2 text-sm text-stone-600">{product.nameEn}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-500">
          {product.slug}
        </p>
      </article>
    </div>
  );
}
