import { useQuery } from "@tanstack/react-query";
import { getCalculatorPricing } from "@/lib/firebase/services";

export function useCalculatorPricing() {
  return useQuery({
    queryKey: ["calculator-pricing"],
    queryFn: getCalculatorPricing,
  });
}
