import { ReactNode } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MainNav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
