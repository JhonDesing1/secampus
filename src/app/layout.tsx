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
  title: {
    default: "Campus Solución Empresarial",
    template: "%s | Campus Solución Empresarial",
  },
  description:
    "Diplomados 100% virtuales y modulares en gestión administrativa, seguridad social, finanzas y estructura empresarial para unidades productivas. Formación práctica con certificación.",
  metadataBase: new URL("https://secampus.com"),
  openGraph: {
    title: "Campus Solución Empresarial",
    description:
      "Formación empresarial práctica con certificación. Diplomados online modulares para emprendedores, pymes y personal administrativo.",
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
