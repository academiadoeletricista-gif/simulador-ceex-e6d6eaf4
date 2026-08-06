import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/useAppStore";
import { 
  Building2, 
  Users, 
  UserPlus, 
  BarChart3, 
  ShieldCheck, 
  Download, 
  Plus, 
  Briefcase,
  TrendingUp,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/b2b")({
  component: B2BPage,
});

function B2BPage() {
  const { organization } = useAppStore();

  if (!organization) return <div>Acesso restrito para empresas.</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Painel Corporativo • <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{organization.subscription.plan}</Badge>
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2">
            <Download size={16} /> Relatórios
          </Button>
          <Button className="flex-1 md:flex-none gap-2">
            <UserPlus size={16} /> Convidar Membro
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Colaboradores Ativos</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32</div>
            <p className="text-xs text-green-500 font-medium mt-1">+4 este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Precisão Média</CardDescription>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Acima da média industrial</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Horas Treinadas</CardDescription>
            <BarChart3 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,240h</div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Certificados</CardDescription>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-green-500 font-medium mt-1">+3 esta semana</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Teams & Departments */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Equipes e Departamentos
              </h2>
              <Button variant="ghost" size="sm" className="gap-2 text-primary">
                <Plus size={14} /> Novo
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organization.teams.map((team) => (
                <Card key={team.id} className="hover:bg-accent/30 transition-colors cursor-pointer border-none bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">{team.memberCount} membros ativos</p>
                      </div>
                      <Badge variant="secondary">Equipe</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progresso na Trilha NR10</span>
                        <span className="font-bold text-primary">85%</span>
                      </div>
                      <Progress value={85} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Pending Invitations */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Convites Pendentes
              </h2>
            </div>
            <Card className="border-none bg-card/50">
              <CardContent className="p-0">
                {[
                  { email: "roberto@industria.com.br", role: "Técnico", date: "Há 2 dias" },
                  { email: "ana.claudia@industria.com.br", role: "Engenheira", date: "Há 4 dias" },
                ].map((invite, i) => (
                  <div key={i} className={cn(
                    "flex items-center justify-between p-4",
                    i !== 0 && "border-t"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                        {invite.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{invite.email}</p>
                        <p className="text-xs text-muted-foreground">{invite.role} • {invite.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-destructive">Cancelar</Button>
                      <Button variant="outline" size="sm">Reenviar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="p-4 rounded-xl bg-background/50 border space-y-3">
                <p className="text-sm font-medium">Trilha Corporativa Privada</p>
                <p className="text-xs text-muted-foreground">Crie uma trilha personalizada com seus próprios equipamentos e procedimentos.</p>
                <Button className="w-full text-xs" size="sm">Criar Trilha</Button>
              </div>
              <div className="p-4 rounded-xl bg-background/50 border space-y-3">
                <p className="text-sm font-medium">Relatório ROI Semanal</p>
                <p className="text-xs text-muted-foreground">Analise o retorno sobre o investimento em treinamento da sua equipe.</p>
                <Button variant="outline" className="w-full text-xs" size="sm">Ver Relatório</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Plano Atual</span>
                <span className="font-bold text-primary">{organization.subscription.plan}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Próxima Fatura</span>
                <span className="font-medium">R$ 1.240,00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium">15/09/2026</span>
              </div>
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/billing">Gerenciar Assinatura</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
