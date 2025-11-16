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
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firebase/services";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import type { Testimonial, PropertyType } from "@/lib/types";

const testimonialSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  propertyType: z.enum(["公屋", "居屋", "私樓", "村屋"]),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "請輸入評價"),
  initials: z.string().min(1, "請輸入縮寫"),
  order: z.number().min(0),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      propertyType: "公屋",
      rating: 5,
      comment: "",
      initials: "",
      order: 0,
    },
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error loading testimonials:", error);
      toast.error("載入評價失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      form.reset({
        name: testimonial.name,
        propertyType: testimonial.propertyType,
        rating: testimonial.rating,
        comment: testimonial.comment,
        initials: testimonial.initials,
        order: testimonial.order,
      });
    } else {
      setEditingTestimonial(null);
      form.reset({
        name: "",
        propertyType: "公屋",
        rating: 5,
        comment: "",
        initials: "",
        order: testimonials.length,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTestimonial(null);
    form.reset();
  };

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, data);
        toast.success("評價已更新");
      } else {
        await createTestimonial(data);
        toast.success("評價已新增");
      }
      handleCloseDialog();
      loadTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error("儲存失敗");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此評價嗎？")) return;
    try {
      await deleteTestimonial(id);
      toast.success("評價已刪除");
      loadTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
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
          <h1 className="text-3xl font-bold">客戶評價管理</h1>
          <p className="text-muted-foreground mt-2">管理客戶評價和推薦</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新增評價
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "編輯評價" : "新增評價"}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial ? "更新評價資訊" : "新增一個新的客戶評價"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input id="name" {...form.register("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initials">縮寫</Label>
                <Input
                  id="initials"
                  {...form.register("initials")}
                  maxLength={2}
                />
              </div>
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
                <Label htmlFor="rating">評分 (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  {...form.register("rating", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">評價內容</Label>
                <Textarea id="comment" {...form.register("comment")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">排序</Label>
                <Input
                  id="order"
                  type="number"
                  {...form.register("order", { valueAsNumber: true })}
                />
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
                <TableHead>姓名</TableHead>
                <TableHead>物業類型</TableHead>
                <TableHead>評分</TableHead>
                <TableHead>評價</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    尚無評價
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>{testimonial.order}</TableCell>
                    <TableCell className="font-medium">
                      {testimonial.name}
                    </TableCell>
                    <TableCell>{testimonial.propertyType}</TableCell>
                    <TableCell>{testimonial.rating} ⭐</TableCell>
                    <TableCell className="max-w-md truncate">
                      {testimonial.comment}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
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
