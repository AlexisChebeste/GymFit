import type { Metadata } from "next";
import {Poppins, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200","400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrackFit",
  description: "Aplicación de seguimiento de actividad física",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", poppins.variable, "font-sans", inter.variable, "dark")}
    >
      <body className="max-h-screen h-full flex flex-col">
        <Header />
        <Toaster />
        {children}

        <Footer />
      </body>
    </html>
  );
}
