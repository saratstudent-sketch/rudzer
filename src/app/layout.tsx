import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import DemoController from "@/components/DemoController";
import { GlobalSimulation } from "@/components/GlobalSimulation";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "R.U.D.Z.E.R- SUBSIDENCE MONITORING",
  description: "AI-powered real-time mine subsidence monitoring, prediction and early-warning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased selection:bg-status-info/30 selection:text-white`}>
        <GlobalSimulation />
        <Navigation />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <DemoController />
      </body>
    </html>
  );
}
