import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  updateService,
  deleteService,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  updateCalculatorPricing,
  updateHeroStats,
  updateConfigItem,
} from "@/lib/supabase";
import type { Service, Testimonial, PortfolioProject } from "@/lib/types";
import { toast } from "sonner";

// Service mutations
export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("服務項目已創建");
    },
    onError: () => {
      toast.error("創建服務項目失敗");
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>;
    }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("服務項目已更新");
    },
    onError: () => {
      toast.error("更新服務項目失敗");
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("服務項目已刪除");
    },
    onError: () => {
      toast.error("刪除服務項目失敗");
    },
  });
}

// Testimonial mutations
export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("客戶評價已創建");
    },
    onError: () => {
      toast.error("創建客戶評價失敗");
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Testimonial, "id" | "createdAt" | "updatedAt">>;
    }) => updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("客戶評價已更新");
    },
    onError: () => {
      toast.error("更新客戶評價失敗");
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("客戶評價已刪除");
    },
    onError: () => {
      toast.error("刪除客戶評價失敗");
    },
  });
}

// Portfolio mutations
export function useCreatePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPortfolioProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
      toast.success("作品項目已創建");
    },
    onError: () => {
      toast.error("創建作品項目失敗");
    },
  });
}

export function useUpdatePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">>;
    }) => updatePortfolioProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
      toast.success("作品項目已更新");
    },
    onError: () => {
      toast.error("更新作品項目失敗");
    },
  });
}

export function useDeletePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePortfolioProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
      toast.success("作品項目已刪除");
    },
    onError: () => {
      toast.error("刪除作品項目失敗");
    },
  });
}

// Calculator pricing mutation
export function useUpdateCalculatorPricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCalculatorPricing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calculator-pricing"] });
      toast.success("計算器設定已更新");
    },
    onError: () => {
      toast.error("更新計算器設定失敗");
    },
  });
}

// Hero stats mutation
export function useUpdateHeroStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHeroStats,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-stats"] });
      toast.success("首頁統計已更新");
    },
    onError: () => {
      toast.error("更新首頁統計失敗");
    },
  });
}

// Config item mutation
export function useUpdateConfigItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      value,
    }: {
      itemId: string;
      value: string | number | boolean | object;
    }) => updateConfigItem(itemId, value),
    onSuccess: () => {
      // Invalidate all config queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["config-item"] });
      toast.success("設定已更新");
    },
    onError: () => {
      toast.error("更新設定失敗");
    },
  });
}
