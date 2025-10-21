import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalBg from "../components/GlobalBg";
import GlobalParticles from "../components/GlobalParticles";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZenviCode",
  description: "Automations and CRM for California businesses",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased theme-trae`}>
        <GlobalBg />
        <GlobalParticles />
        {children}
      </body>
    </html>
  );
}
