import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/supabase";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });
}
