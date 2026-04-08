import { AdminLoginForm } from "@/components/admin/admin-login-form";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <section className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <AdminLoginForm nextPath={params.next} />
    </section>
  );
}
