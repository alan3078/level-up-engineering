import { useQuery } from "@tanstack/react-query";
import { getConfigItemByKey } from "@/lib/supabase";

export function useConfigItem(key: string) {
  return useQuery({
    queryKey: ["config-item", key],
    queryFn: () => getConfigItemByKey(key),
    enabled: !!key,
  });
}
