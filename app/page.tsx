import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Services } from "@/components/company/services";
import { Testimonials } from "@/components/company/testimonials";
import { HeroBanner } from "@/components/home/hero-banner";
import { ScrollAnimation, FadeIn } from "@/components/home/scroll-animation";
import { Calculator, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner with Scroll Animation */}
      <HeroBanner />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <FadeIn delay={0.1}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>專業團隊</CardTitle>
                  <CardDescription>
                    20年經驗的專業裝修團隊，確保工程質素
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>透明報價</CardTitle>
                  <CardDescription>
                    詳細報價單，價格透明，無隱藏費用
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>保養服務</CardTitle>
                  <CardDescription>
                    提供裝修後保養服務，確保長期質素
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <Services />
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <Testimonials />
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <ScrollAnimation>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  準備開始您的裝修項目？
                </h2>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  立即使用我們的免費報價計算器，獲取專業裝修建議
                </p>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/calculator">
                  開始計算
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollAnimation>
      </section>
    </div>
  );
}
