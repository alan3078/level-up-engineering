"use client";

import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FixedLayout } from "@/components/layout/fixed-layout";
import { useServices } from "@/lib/hooks";
import type { Service } from "@/lib/types";
import * as Icons from "lucide-react";
import { localize } from "@/lib/i18n";
import { useLocale } from "@/lib/providers/locale-provider";
import { useTranslations } from "next-intl";

// Fallback services
const fallbackServices: Service[] = [
  {
    id: "1",
    icon: "Home",
    title: "全屋裝修",
    description: "提供一站式全屋裝修服務，從設計到施工，為您打造理想家居。",
    order: 0,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    icon: "Paintbrush",
    title: "室內設計",
    description: "專業設計團隊為您提供個性化室內設計方案，滿足不同風格需求。",
    order: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    icon: "Wrench",
    title: "水電工程",
    description: "專業水電師傅提供安全可靠的水電改動及維修服務。",
    order: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    icon: "Hammer",
    title: "拆牆改動",
    description: "安全專業的拆牆及結構改動服務，擴大空間利用率。",
    order: 3,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "5",
    icon: "Palette",
    title: "訂造傢俬",
    description: "量身訂造傢俬，充分利用空間，打造獨一無二的家居。",
    order: 4,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "6",
    icon: "Shield",
    title: "保養維修",
    description: "提供裝修後保養及維修服務，確保工程質素。",
    order: 5,
    createdAt: "",
    updatedAt: "",
  },
];

export function Services() {
  const { locale } = useLocale();
  const t = useTranslations("Home");
  const { data: servicesData = [] } = useServices();
  const services = servicesData.length > 0 ? servicesData : fallbackServices;

  const getIcon = (iconName: string) => {
    const IconComponent =
      (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }>
        >
      )[iconName] || Icons.Home;
    return IconComponent;
  };
  return (
    <FixedLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t("servicesTitle")}</h2>
          <p className="text-muted-foreground">{t("servicesSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{localize(service.title, locale)}</CardTitle>
                  <CardDescription>{localize(service.description, locale)}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </FixedLayout>
  );
}
