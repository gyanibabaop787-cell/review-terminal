import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TW WILL",
  description: "Simple, fast, mobile-first review website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
