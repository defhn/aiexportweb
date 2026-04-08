import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export Growth Website System",
  description: "English export lead generation website with a Chinese admin.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
