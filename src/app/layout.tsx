import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mushy Parfum — Scent of Elegance",
  description: "Luxury Arabic & Oriental perfumery crafted for those who command presence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
