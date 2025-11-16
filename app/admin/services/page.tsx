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
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/firebase/services";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import type { Service } from "@/lib/types";

const serviceSchema = z.object({
  icon: z.string().min(1, "請選擇圖標"),
  title: z.string().min(1, "請輸入標題"),
  description: z.string().min(1, "請輸入描述"),
  order: z.number().min(0),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const iconOptions = [
  "Home",
  "Paintbrush",
  "Wrench",
  "Hammer",
  "Palette",
  "Shield",
  "Settings",
  "Tool",
  "Droplet",
  "Zap",
  "Layers",
  "Box",
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      icon: "Home",
      title: "",
      description: "",
      order: 0,
    },
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("載入服務失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      form.reset({
        icon: service.icon,
        title: service.title,
        description: service.description,
        order: service.order,
      });
    } else {
      setEditingService(null);
      form.reset({
        icon: "Home",
        title: "",
        description: "",
        order: services.length,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
    form.reset();
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (editingService) {
        await updateService(editingService.id, data);
        toast.success("服務已更新");
      } else {
        await createService(data);
        toast.success("服務已新增");
      }
      handleCloseDialog();
      loadServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("儲存失敗");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此服務嗎？")) return;
    try {
      await deleteService(id);
      toast.success("服務已刪除");
      loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
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
          <h1 className="text-3xl font-bold">服務項目管理</h1>
          <p className="text-muted-foreground mt-2">管理公司提供的服務項目</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新增服務
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "編輯服務" : "新增服務"}
              </DialogTitle>
              <DialogDescription>
                {editingService ? "更新服務資訊" : "新增一個新的服務項目"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon">圖標名稱</Label>
                <select
                  id="icon"
                  {...form.register("icon")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">標題</Label>
                <Input id="title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea id="description" {...form.register("description")} />
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
                <TableHead>圖標</TableHead>
                <TableHead>標題</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    尚無服務項目
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.order}</TableCell>
                    <TableCell>{service.icon}</TableCell>
                    <TableCell className="font-medium">
                      {service.title}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {service.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
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
