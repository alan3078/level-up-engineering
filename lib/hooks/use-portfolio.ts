import { useQuery } from "@tanstack/react-query";
import { getPortfolioProjects } from "@/lib/supabase";

export function usePortfolioProjects() {
  return useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: getPortfolioProjects,
  });
}
