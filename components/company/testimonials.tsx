"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FixedLayout } from "@/components/layout/fixed-layout";
import { Star } from "lucide-react";
import { useTestimonials } from "@/lib/hooks";
import type { Testimonial } from "@/lib/types";
import { localize } from "@/lib/i18n";
import { useLocale } from "@/lib/providers/locale-provider";
import { useTranslations } from "next-intl";

// Fallback testimonials
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "王太",
    propertyType: "公屋",
    rating: 5,
    comment: "非常滿意裝修效果！師傅專業細心，準時完工，價錢合理。",
    initials: "王",
    order: 0,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    name: "李先生",
    propertyType: "私樓",
    rating: 5,
    comment: "設計師很有創意，將我們的想法完美實現。整體質素很高，值得推薦！",
    initials: "李",
    order: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    name: "張小姐",
    propertyType: "居屋",
    rating: 5,
    comment: "從報價到完工都很專業，溝通順暢，工程進度透明。非常滿意！",
    initials: "張",
    order: 2,
    createdAt: "",
    updatedAt: "",
  },
];

export function Testimonials() {
  const { locale } = useLocale();
  const t = useTranslations("Home");
  const { data: testimonialsData = [] } = useTestimonials();
  const testimonials =
    testimonialsData.length > 0 ? testimonialsData : fallbackTestimonials;
  return (
    <FixedLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t("testimonialsTitle")}</h2>
          <p className="text-muted-foreground">{t("testimonialsSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.propertyType} {t("owner")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {'"'}
                  {localize(testimonial.comment, locale)}
                  {'"'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </FixedLayout>
  );
}
