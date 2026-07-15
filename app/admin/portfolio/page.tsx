"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPortfolioProjects,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
} from "@/lib/supabase";
import { localize } from "@/lib/i18n";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import type { PortfolioProject, PropertyType } from "@/lib/types";

const portfolioSchema = z.object({
  title: z.string().min(1, "請輸入標題"),
  propertyType: z.enum(["公屋", "居屋", "私樓", "村屋"]),
  budgetRange: z.string().min(1, "請輸入預算範圍"),
  style: z.string().min(1, "請輸入風格"),
  beforeImage: z.string().url("請輸入有效的圖片 URL"),
  afterImage: z.string().url("請輸入有效的圖片 URL"),
  cost: z.number().min(0),
  description: z.string().min(1, "請輸入描述"),
  completedDate: z.string().min(1, "請輸入完成日期"),
  order: z.number().min(0),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(
    null
  );
  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      propertyType: "公屋",
      budgetRange: "",
      style: "",
      beforeImage: "",
      afterImage: "",
      cost: 0,
      description: "",
      completedDate: "",
      order: 0,
    },
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("載入作品集失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (project?: PortfolioProject) => {
    if (project) {
      setEditingProject(project);
      form.reset({
        title: localize(project.title, "en-US"),
        propertyType: project.propertyType,
        budgetRange: localize(project.budgetRange, "en-US"),
        style: localize(project.style, "en-US"),
        beforeImage: project.beforeImage,
        afterImage: project.afterImage,
        cost: project.cost,
        description: localize(project.description, "en-US"),
        completedDate: project.completedDate,
        order: project.order || 0,
      });
    } else {
      setEditingProject(null);
      form.reset({
        title: "",
        propertyType: "公屋",
        budgetRange: "",
        style: "",
        beforeImage: "",
        afterImage: "",
        cost: 0,
        description: "",
        completedDate: "",
        order: projects.length,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
    form.reset();
  };

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      if (editingProject) {
        await updatePortfolioProject(editingProject.id, data);
        toast.success("作品已更新");
      } else {
        await createPortfolioProject(data);
        toast.success("作品已新增");
      }
      handleCloseDialog();
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("儲存失敗");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此作品嗎？")) return;
    try {
      await deletePortfolioProject(id);
      toast.success("作品已刪除");
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("刪除失敗");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">作品集管理</h1>
          <p className="text-muted-foreground mt-2">管理作品集項目</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新增作品
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "編輯作品" : "新增作品"}
              </DialogTitle>
              <DialogDescription>
                {editingProject ? "更新作品資訊" : "新增一個新的作品集項目"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">標題</Label>
                <Input id="title" {...form.register("title")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">物業類型</Label>
                  <Select
                    value={form.watch("propertyType")}
                    onValueChange={(value) =>
                      form.setValue("propertyType", value as PropertyType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="公屋">公屋</SelectItem>
                      <SelectItem value="居屋">居屋</SelectItem>
                      <SelectItem value="私樓">私樓</SelectItem>
                      <SelectItem value="村屋">村屋</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">風格</Label>
                  <Input id="style" {...form.register("style")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">預算範圍</Label>
                  <Input
                    id="budgetRange"
                    {...form.register("budgetRange")}
                    placeholder="例如: 30-50萬"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">實際成本 (HKD)</Label>
                  <Input
                    id="cost"
                    type="number"
                    {...form.register("cost", { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="beforeImage">裝修前圖片 URL</Label>
                <Input id="beforeImage" {...form.register("beforeImage")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="afterImage">裝修後圖片 URL</Label>
                <Input id="afterImage" {...form.register("afterImage")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completedDate">完成日期</Label>
                  <Input
                    id="completedDate"
                    {...form.register("completedDate")}
                    placeholder="例如: 2024-01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">排序</Label>
                  <Input
                    id="order"
                    type="number"
                    {...form.register("order", { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea id="description" {...form.register("description")} />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  取消
                </Button>
                <Button type="submit">儲存</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>排序</TableHead>
                <TableHead>標題</TableHead>
                <TableHead>物業類型</TableHead>
                <TableHead>風格</TableHead>
                <TableHead>成本</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    尚無作品
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.order || 0}</TableCell>
                    <TableCell className="font-medium">
                      {localize(project.title, "en-US")}
                    </TableCell>
                    <TableCell>{project.propertyType}</TableCell>
                    <TableCell>{localize(project.style, "en-US")}</TableCell>
                    <TableCell>${project.cost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
