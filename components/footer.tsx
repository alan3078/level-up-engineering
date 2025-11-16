"use client";

import Link from "next/link";
import { FixedLayout } from "@/components/layout/fixed-layout";
import { useConfigItem } from "@/lib/hooks";

export function Footer() {
  const { data: companyName } = useConfigItem("company_name");
  const { data: contactPhone } = useConfigItem("contact_phone");
  const { data: contactEmail } = useConfigItem("contact_email");
  const { data: contactAddress } = useConfigItem("contact_address");
  const { data: contactWhatsApp } = useConfigItem("contact_whatsapp");
  const { data: contactWhatsAppMessage } = useConfigItem(
    "contact_whatsapp_message"
  );

  const companyNameText =
    companyName && typeof companyName.value === "string"
      ? companyName.value
      : "豐進裝修工程有限公司";

  const phoneText =
    contactPhone && typeof contactPhone.value === "string"
      ? contactPhone.value
      : null;
  const phoneLabel = contactPhone?.description || contactPhone?.label || "電話";

  const emailText =
    contactEmail && typeof contactEmail.value === "string"
      ? contactEmail.value
      : null;
  const emailLabel = contactEmail?.description || contactEmail?.label || "電郵";

  const addressText =
    contactAddress && typeof contactAddress.value === "string"
      ? contactAddress.value
      : null;
  const addressLabel =
    contactAddress?.description || contactAddress?.label || "地址";

  const whatsappText =
    contactWhatsApp && typeof contactWhatsApp.value === "string"
      ? contactWhatsApp.value
      : null;
  const whatsappLabel =
    contactWhatsApp?.description || contactWhatsApp?.label || "WhatsApp";

  // Generate WhatsApp URL with pre-filled message
  const getWhatsAppUrl = (phone: string) => {
    // Remove all non-numeric characters except + for international format
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    // Use configured message (empty string if not configured)
    const messageText =
      contactWhatsAppMessage && typeof contactWhatsAppMessage.value === "string"
        ? contactWhatsAppMessage.value
        : "";
    // Only add text parameter if message is not empty
    if (messageText) {
      const message = encodeURIComponent(messageText);
      return `https://wa.me/${cleanPhone}?text=${message}`;
    }
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <footer className="border-t bg-muted/50">
      <FixedLayout>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">快速連結</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      首頁
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculator"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      成本計算器
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/portfolio"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      作品集
                    </Link>
                  </li>
                </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">關於我們</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    公司簡介
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    聯絡我們
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">聯絡資訊</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {phoneText && (
                  <li>
                    {phoneLabel}: {phoneText}
                  </li>
                )}
                {emailText && (
                  <li>
                    {emailLabel}: {emailText}
                  </li>
                )}
                {addressText && (
                  <li>
                    {addressLabel}: {addressText}
                  </li>
                )}
                {whatsappText && (
                  <li>
                    <a
                      href={getWhatsAppUrl(whatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {whatsappLabel}: {whatsappText}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {companyNameText}. 版權所有.
            </p>
          </div>
        </div>
      </FixedLayout>
    </footer>
  );
}
