import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Solución Empresarial",
  description:
    "Diplomados y cursos en gestión administrativa y estructura empresarial para unidades productivas. Formación práctica con certificación.",
  metadataBase: new URL("https://secampus.com"),
  openGraph: {
    title: "Campus Solución Empresarial",
    description:
      "Formación empresarial práctica con certificación oficial. Diplomados online para unidades productivas.",
    url: "https://secampus.com",
    siteName: "Campus Solución Empresarial",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">{children}</body>
    </html>
  );
}
