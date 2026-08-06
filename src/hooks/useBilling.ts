import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";

export interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  current_period_end: string;
  amount: number;
  currency: string;
  interval: string;
}

export interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: string;
  invoice_url: string;
}

export const useBilling = () => {
  return useQuery({
    queryKey: ['billing'],
    queryFn: async (): Promise<Result<{ subscription: Subscription | null, history: BillingHistory[] }>> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return fail("User not authenticated");

        // Placeholder for real billing logic (Stripe/Paddle)
        const subscription: Subscription = {
          id: 'sub_123',
          plan_name: 'Enterprise Pro',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 49900,
          currency: 'BRL',
          interval: 'month'
        };

        const history: BillingHistory[] = [
          {
            id: 'inv_001',
            date: new Date().toISOString(),
            amount: 49900,
            status: 'paid',
            invoice_url: '#'
          }
        ];

        return ok({ subscription, history });
      } catch (e: any) {
        return fail(e.message);
      }
    },
  });
};
