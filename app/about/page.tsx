import { Services } from "@/components/company/services";
import { Team } from "@/components/company/team";
import { Testimonials } from "@/components/company/testimonials";

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">關於我們</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          我們是一間擁有20年經驗的專業裝修公司，專注於為香港客戶提供優質的裝修及設計服務。
          我們的團隊由經驗豐富的師傅和設計師組成，致力於為每位客戶打造理想的家居環境。
        </p>
      </div>
      <Services />
      <Team />
      <Testimonials />
    </div>
  );
}

