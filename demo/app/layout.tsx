import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../src/GoogleTranslate.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Google Translate Picker React Demo",
  description: "A highly customizable React language picker for Google Translate Picker React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
