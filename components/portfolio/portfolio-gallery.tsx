"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioProject, PropertyType } from "@/lib/types";
import { formatCurrency } from "@/lib/calculator";
import { Eye } from "lucide-react";

// Sample portfolio data with mock images from Unsplash
const SAMPLE_PROJECTS: PortfolioProject[] = [
  {
    id: "1",
    title: "現代簡約風格公屋裝修",
    propertyType: "公屋",
    budgetRange: "30-50萬",
    style: "現代簡約",
    beforeImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80",
    cost: 400000,
    description: "300平方呎公屋單位，採用現代簡約風格，全屋翻新包括訂造傢俬。",
    completedDate: "2024-01",
  },
  {
    id: "2",
    title: "豪華私樓全屋裝修",
    propertyType: "私樓",
    budgetRange: "80-120萬",
    style: "豪華",
    beforeImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&q=80",
    cost: 1000000,
    description: "800平方呎私樓單位，豪華級別裝修，包括拆牆改動及訂造傢俬。",
    completedDate: "2024-02",
  },
  {
    id: "3",
    title: "溫馨居屋局部裝修",
    propertyType: "居屋",
    budgetRange: "20-30萬",
    style: "溫馨",
    beforeImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop&q=80",
    cost: 250000,
    description: "400平方呎居屋單位，局部裝修廚房及浴室，標準級別材料。",
    completedDate: "2024-03",
  },
  {
    id: "4",
    title: "簡約村屋翻新",
    propertyType: "村屋",
    budgetRange: "40-60萬",
    style: "現代簡約",
    beforeImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&q=80",
    cost: 500000,
    description: "600平方呎村屋單位，現代簡約風格，全屋翻新。",
    completedDate: "2024-04",
  },
  {
    id: "5",
    title: "豪華居屋設計",
    propertyType: "居屋",
    budgetRange: "50-70萬",
    style: "豪華",
    beforeImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop&q=80",
    cost: 600000,
    description: "500平方呎居屋單位，豪華級別裝修，包括訂造傢俬。",
    completedDate: "2024-05",
  },
  {
    id: "6",
    title: "溫馨公屋翻新",
    propertyType: "公屋",
    budgetRange: "25-35萬",
    style: "溫馨",
    beforeImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop&q=80",
    cost: 300000,
    description: "280平方呎公屋單位，溫馨風格，局部裝修。",
    completedDate: "2024-06",
  },
];

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50);

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt="After"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt="Before"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-10"
      />
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
        </div>
      </div>
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        裝修前
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        裝修後
      </div>
    </div>
  );
}

export function PortfolioGallery() {
  const [projects, setProjects] = React.useState<PortfolioProject[]>(SAMPLE_PROJECTS);
  const [selectedProject, setSelectedProject] = React.useState<PortfolioProject | null>(null);
  const [filterPropertyType, setFilterPropertyType] = React.useState<string>("全部");
  const [filterStyle, setFilterStyle] = React.useState<string>("全部");

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesPropertyType =
        filterPropertyType === "全部" || project.propertyType === filterPropertyType;
      const matchesStyle = filterStyle === "全部" || project.style === filterStyle;
      return matchesPropertyType && matchesStyle;
    });
  }, [projects, filterPropertyType, filterStyle]);

  const uniqueStyles = Array.from(new Set(projects.map((p) => p.style)));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">設計作品集</h2>
        <p className="text-muted-foreground">
          瀏覽我們過往的裝修項目，了解不同風格和預算的裝修效果
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="物業類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部物業類型</SelectItem>
            <SelectItem value="公屋">公屋</SelectItem>
            <SelectItem value="居屋">居屋</SelectItem>
            <SelectItem value="私樓">私樓</SelectItem>
            <SelectItem value="村屋">村屋</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStyle} onValueChange={setFilterStyle}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="裝修風格" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部風格</SelectItem>
            {uniqueStyles.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader>
              <div className="relative w-full h-48 overflow-hidden rounded-lg mb-4">
                <Image
                  src={project.afterImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Eye className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{project.propertyType}</Badge>
                <Badge variant="outline">{project.style}</Badge>
                <Badge variant="outline">{project.budgetRange}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                完成日期: {project.completedDate}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">沒有找到符合條件的項目</p>
        </div>
      )}

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>{selectedProject.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <BeforeAfterSlider
                  beforeImage={selectedProject.beforeImage}
                  afterImage={selectedProject.afterImage}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">物業類型</p>
                    <p className="font-semibold">{selectedProject.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">裝修風格</p>
                    <p className="font-semibold">{selectedProject.style}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">預算範圍</p>
                    <p className="font-semibold">{selectedProject.budgetRange}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">實際成本</p>
                    <p className="font-semibold">{formatCurrency(selectedProject.cost)}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

