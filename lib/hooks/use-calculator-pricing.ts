import { useQuery } from "@tanstack/react-query";
import { getCalculatorPricing } from "@/lib/supabase";

export function useCalculatorPricing() {
  return useQuery({
    queryKey: ["calculator-pricing"],
    queryFn: getCalculatorPricing,
  });
}
