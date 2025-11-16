import { useQuery } from "@tanstack/react-query";
import { getPortfolioProjects } from "@/lib/firebase/services";

export function usePortfolioProjects() {
  return useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: getPortfolioProjects,
  });
}
