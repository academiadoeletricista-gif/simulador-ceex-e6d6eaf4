import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  requirements?: string;
}

export const useMarketplace = () => {
  return useQuery({
    queryKey: ['marketplace'],
    queryFn: async (): Promise<Result<Product[]>> => {
      try {
        const { data, error } = await supabase
          .from('marketplace_items')
          .select('*');

        if (error) return fail(error.message, error.code);

        const products = (data || []).map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          image: p.image_url || '',
          requirements: p.requirements
        }));

        return ok(products);
      } catch (e: any) {
        return fail(e.message);
      }
    },
  });
};
