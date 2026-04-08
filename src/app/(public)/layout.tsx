export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="min-h-screen bg-stone-50 text-slate-950">{children}</main>;
}
