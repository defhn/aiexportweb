export function SiteFooter({
  companyName,
  email,
  phone,
  address,
}: {
  companyName: string;
  email: string;
  phone: string;
  address: string;
}) {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-stone-950">{companyName}</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            English public experience for overseas buyers, Chinese admin workflow
            for factory teams.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Contact
          </p>
          <p className="mt-3 text-sm text-stone-700">{email}</p>
          <p className="mt-2 text-sm text-stone-700">{phone}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Address
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">{address}</p>
        </div>
      </div>
    </footer>
  );
}
