

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FloatingTimer from "@/components/ui/FloatingTimer";
import { Toaster } from "@/components/ui/sonner";
import Timer from "@/components/workout/Timer";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Toaster />
      <FloatingTimer />
      {children}
      
      <Timer />

      <Footer />
    </>
  );
}
