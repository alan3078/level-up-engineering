"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "王太",
    propertyType: "公屋",
    rating: 5,
    comment: "非常滿意裝修效果！師傅專業細心，準時完工，價錢合理。",
    initials: "王",
  },
  {
    name: "李先生",
    propertyType: "私樓",
    rating: 5,
    comment: "設計師很有創意，將我們的想法完美實現。整體質素很高，值得推薦！",
    initials: "李",
  },
  {
    name: "張小姐",
    propertyType: "居屋",
    rating: 5,
    comment: "從報價到完工都很專業，溝通順暢，工程進度透明。非常滿意！",
    initials: "張",
  },
];

export function Testimonials() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">客戶評價</h2>
        <p className="text-muted-foreground">
          真實客戶評價，了解我們的服務質素
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.propertyType}業主
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
                "{testimonial.comment}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

