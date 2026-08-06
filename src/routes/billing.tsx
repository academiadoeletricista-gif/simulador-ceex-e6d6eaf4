import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Receipt, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download
} from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
});

function BillingPage() {
  const { data: billingResult, isLoading } = useBilling();

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  const { subscription, history } = billingResult?.success ? billingResult.data : { subscription: null, history: [] };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Faturamento e Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seus planos, métodos de pagamento e histórico de faturas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-primary">Plano Atual</CardDescription>
                <CardTitle className="text-3xl">{subscription?.plan_name || "Gratuito"}</CardTitle>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
                {subscription?.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Próxima Cobrança</p>
                <div className="flex items-center gap-2 font-semibold">
                  <Calendar size={16} className="text-primary" />
                  {subscription ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Valor do Ciclo</p>
                <div className="flex items-center gap-2 font-bold text-xl">
                  {subscription ? `R$ ${(subscription.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
                  <span className="text-xs font-normal text-muted-foreground">/ {subscription?.interval === 'month' ? 'mês' : 'ano'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Incluso no seu plano</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-green-500" /> Acesso ilimitado a 72 laboratórios
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-green-500" /> Certificações oficiais ilimitadas
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-green-500" /> Dashboard B2B para até 10 técnicos
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-green-500" /> Suporte prioritário 24/7
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 bg-muted/20">
            <div className="flex gap-4">
              <Button className="gap-2">Alterar Plano <ArrowRight size={16} /></Button>
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">Cancelar Assinatura</Button>
            </div>
          </CardFooter>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard size={18} /> Método de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl border-2 border-primary/20 bg-background flex items-center gap-4">
              <div className="h-10 w-16 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">VISA</div>
              <div className="flex-1">
                <p className="font-bold">•••• 4242</p>
                <p className="text-[10px] text-muted-foreground">Expira em 12/28</p>
              </div>
              <CheckCircle2 size={20} className="text-primary" />
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2 text-primary">
              <Zap size={16} /> Atualizar cartão
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt size={18} /> Histórico de Faturas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {history.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Fatura {invoice.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Pago</Badge>
                  <p className="font-mono font-bold">R$ {(invoice.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={invoice.invoice_url}><Download size={18} /></a>
                  </Button>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="p-12 text-center text-muted-foreground italic">
                Nenhuma fatura encontrada.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
