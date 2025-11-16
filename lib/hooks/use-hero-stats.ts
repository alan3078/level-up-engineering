import { useQuery } from "@tanstack/react-query";
import { getHeroStats } from "@/lib/firebase/services";

export function useHeroStats() {
  return useQuery({
    queryKey: ["hero-stats"],
    queryFn: getHeroStats,
  });
}
