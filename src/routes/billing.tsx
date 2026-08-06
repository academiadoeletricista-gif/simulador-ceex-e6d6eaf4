import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Users, 
  Globe, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
});

const PLANS = [
  {
    name: "Starter",
    price: "R$ 49",
    description: "Ideal para estudantes e entusiastas em início de carreira.",
    features: ["Acesso a 50 casos/mês", "Tutor IA Básico", "Certificações Bronze", "Comunidade Global"],
    buttonText: "Começar Agora",
    popular: false,
  },
  {
    name: "Professional",
    price: "R$ 99",
    description: "Para profissionais que buscam excelência técnica diária.",
    features: ["Casos Ilimitados", "Tutor IA Avançado", "Todas as Certificações", "Relatórios de Evolução", "Marketplace Privado"],
    buttonText: "Assinar Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    description: "Solução completa para indústrias e centros técnicos.",
    features: ["Painel Corporativo", "Trilhas Privadas", "Relatórios ROI", "Gestão de Equipes", "Suporte Prioritário", "SSO & API"],
    buttonText: "Falar com Consultor",
    popular: false,
  }
];

function BillingPage() {
  const { organization } = useAppStore();
  const currentPlan = organization?.subscription.plan || "Free";

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto pb-20">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Planos e Assinaturas</h1>
        <p className="text-muted-foreground text-lg">
          Escolha o plano ideal para sua evolução profissional ou para a gestão técnica da sua empresa.
        </p>
      </header>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={cn(
            "flex flex-col relative overflow-hidden",
            plan.popular ? "border-primary shadow-lg shadow-primary/10 bg-primary/5" : "bg-card/50",
            currentPlan === plan.name && "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}>
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-8 py-1 rotate-45 translate-x-[26px] translate-y-[10px]">
                  Popular
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {currentPlan === plan.name && <Badge>Seu Plano</Badge>}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Sob consulta" && <span className="text-muted-foreground text-sm">/mês</span>}
              </div>
              <CardDescription className="min-h-[3rem]">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className={cn("w-full gap-2", plan.popular ? "bg-primary" : "bg-muted hover:bg-muted/80 text-foreground")}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.buttonText} <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ / Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t">
        <div className="space-y-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold">Segurança Stripe</h3>
          <p className="text-sm text-muted-foreground">Pagamentos processados com criptografia de ponta a ponta via Stripe.</p>
        </div>
        <div className="space-y-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Zap size={24} />
          </div>
          <h3 className="font-bold">Ativação Instantânea</h3>
          <p className="text-sm text-muted-foreground">Seu acesso é desbloqueado no momento em que o pagamento é confirmado.</p>
        </div>
        <div className="space-y-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <h3 className="font-bold">Upgrade Flexível</h3>
          <p className="text-sm text-muted-foreground">Mude de plano a qualquer momento. O valor será proporcional ao uso.</p>
        </div>
        <div className="space-y-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold">Marketplace Credits</h3>
          <p className="text-sm text-muted-foreground">Assinantes Professional ganham 500 créditos mensais para o Marketplace.</p>
        </div>
      </section>

      {/* Subscription Management (Mock) */}
      {organization && (
        <Card className="bg-card/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Gestão de Assinatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl border bg-background/50">
              <div className="space-y-1">
                <p className="text-sm font-medium">Método de Pagamento</p>
                <p className="text-xs text-muted-foreground">Visa terminado em 4242 • Expira em 12/28</p>
              </div>
              <Button variant="outline" size="sm">Alterar Cartão</Button>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl border bg-background/50">
              <div className="space-y-1">
                <p className="text-sm font-medium">Histórico de Faturas</p>
                <p className="text-xs text-muted-foreground">Acesse e faça download de todas as suas notas fiscais.</p>
              </div>
              <Button variant="outline" size="sm">Ver Faturas</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
