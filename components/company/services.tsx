"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Paintbrush, Wrench, Home, Palette, Shield } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "全屋裝修",
    description: "提供一站式全屋裝修服務，從設計到施工，為您打造理想家居。",
  },
  {
    icon: Paintbrush,
    title: "室內設計",
    description: "專業設計團隊為您提供個性化室內設計方案，滿足不同風格需求。",
  },
  {
    icon: Wrench,
    title: "水電工程",
    description: "專業水電師傅提供安全可靠的水電改動及維修服務。",
  },
  {
    icon: Hammer,
    title: "拆牆改動",
    description: "安全專業的拆牆及結構改動服務，擴大空間利用率。",
  },
  {
    icon: Palette,
    title: "訂造傢俬",
    description: "量身訂造傢俬，充分利用空間，打造獨一無二的家居。",
  },
  {
    icon: Shield,
    title: "保養維修",
    description: "提供裝修後保養及維修服務，確保工程質素。",
  },
];

export function Services() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">我們的服務</h2>
        <p className="text-muted-foreground">
          提供專業全面的裝修及設計服務，滿足您的各種需求
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

