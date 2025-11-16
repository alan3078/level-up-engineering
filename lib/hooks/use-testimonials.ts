import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@/lib/firebase/services";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });
}
