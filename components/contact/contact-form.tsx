"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FixedLayout } from "@/components/layout/fixed-layout";
import { toast } from "sonner";
import { MessageCircle, Phone } from "lucide-react";
import { useConfigItem } from "@/lib/hooks";

const contactSchema = z.object({
  name: z.string().min(2, "請輸入姓名"),
  phone: z.string().min(8, "請輸入有效電話號碼"),
  email: z.string().email("請輸入有效電郵地址").optional().or(z.literal("")),
  message: z.string().min(10, "請輸入至少10個字"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { data: contactPhone } = useConfigItem("contact_phone");
  const { data: contactWhatsApp } = useConfigItem("contact_whatsapp");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const phoneNumber =
    contactPhone && typeof contactPhone.value === "string"
      ? contactPhone.value.replace(/\s+/g, "").replace(/\+/g, "")
      : "85212345678";

  const whatsappNumber =
    contactWhatsApp && typeof contactWhatsApp.value === "string"
      ? contactWhatsApp.value.replace(/\s+/g, "").replace(/\+/g, "")
      : phoneNumber;

  const phoneDisplay =
    contactPhone && typeof contactPhone.value === "string"
      ? contactPhone.value
      : "+852 1234 5678";

  const onSubmit = async (data: ContactFormData) => {
    // In a real app, this would send to an API
    console.log("Form submitted:", data);

    toast.success("表單已提交", {
      description: "我們會盡快與您聯絡！",
    });
  };

  const openWhatsApp = () => {
    const message = "您好，我想查詢裝修服務。";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <FixedLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">聯絡我們</CardTitle>
            <CardDescription>
              填寫以下表格或直接透過 WhatsApp 聯絡我們
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={openWhatsApp}
              className="w-full"
              variant="default"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              透過 WhatsApp 聯絡
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或填寫表格
                </span>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名 *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="請輸入您的姓名"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">電話號碼 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  placeholder="請輸入電話號碼"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">電郵地址 (選填)</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="請輸入電郵地址"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">查詢內容 *</Label>
                <Textarea
                  id="message"
                  {...form.register("message")}
                  placeholder="請描述您的裝修需求..."
                  rows={5}
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg">
                提交查詢
              </Button>
            </form>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>
                  {contactPhone?.description || contactPhone?.label || "電話"}：
                  {phoneDisplay}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FixedLayout>
  );
}
