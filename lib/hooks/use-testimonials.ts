import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@/lib/supabase";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });
}
