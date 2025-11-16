"use client";

import { Services } from "@/components/company/services";
import { Team } from "@/components/company/team";
import { Testimonials } from "@/components/company/testimonials";
import { FixedLayout } from "@/components/layout/fixed-layout";
import { useConfigItem } from "@/lib/hooks";

export default function AboutPage() {
  const { data: companyDescription } = useConfigItem("company_description");

  const aboutText =
    companyDescription && typeof companyDescription.value === "string"
      ? companyDescription.value
      : "豐進工程有限公司\n\n- 多年裝修經驗 信心保證 -\n\n承接大小工程，室內裝修設計，訂造/安裝傢俬\n\n服務承諾：免費上門度尺報價，絕不含隱藏收費，明碼實價，\n親力親為，包半年保養，絕不爛尾\n\n-請WhatsApp 64798033查詢-";

  return (
    <div className="py-8 md:py-12 space-y-16">
      <FixedLayout>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">公司簡介</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-base leading-relaxed whitespace-pre-line text-muted-foreground">
              {aboutText}
            </p>
          </div>
        </div>
      </FixedLayout>

      <Services />
      <Team />
      <Testimonials />
    </div>
  );
}
