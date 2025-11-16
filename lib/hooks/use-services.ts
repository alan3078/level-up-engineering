import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/firebase/services";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });
}
