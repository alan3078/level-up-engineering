import { useQuery } from "@tanstack/react-query";
import { getHeroStats } from "@/lib/supabase";

export function useHeroStats() {
  return useQuery({
    queryKey: ["hero-stats"],
    queryFn: getHeroStats,
  });
}
