import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Clock, Target, Calendar } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/40 relative">
          <Avatar className="h-28 w-28">
            <AvatarFallback className="text-4xl">CA</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground h-10 w-10 rounded-full flex items-center justify-center font-bold border-4 border-background">
            12
          </div>
        </div>
        <div className="space-y-2 flex-1">
          <h1 className="text-4xl font-bold tracking-tight">Eng. Carlos Alberto</h1>
          <p className="text-xl text-muted-foreground italic">Especialista em Automação Industrial</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge className="bg-primary/20 text-primary border-primary/20">Membro Premium</Badge>
            <Badge variant="secondary">Top 10 Mensal</Badge>
            <Badge variant="outline">Instrutor Certificado</Badge>
          </div>
        </div>
        <Button size="lg" className="bg-primary hover:bg-primary/90">Editar Perfil</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Progresso de XP</CardTitle>
            <CardDescription>Você está a 550 XP do Nível 13</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Nível 12</span>
              <span>2.450 / 3.000 XP</span>
            </div>
            <Progress value={81} className="h-3" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-muted/20 border border-muted flex flex-col items-center">
                <Trophy className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold">#42</span>
                <span className="text-xs text-muted-foreground">Ranking Global</span>
              </div>
              <div className="p-4 rounded-xl bg-muted/20 border border-muted flex flex-col items-center">
                <Award className="h-6 w-6 text-secondary mb-2" />
                <span className="text-2xl font-bold">15</span>
                <span className="text-xs text-muted-foreground">Medalhas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Estatísticas de Carreira</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Target className="h-4 w-4" /> Precisão
              </div>
              <p className="text-2xl font-bold">98.4%</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="h-4 w-4" /> Tempo Médio
              </div>
              <p className="text-2xl font-bold">4m 12s</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" /> Sequência
              </div>
              <p className="text-2xl font-bold">12 Dias</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Trophy className="h-4 w-4" /> Casos Concluídos
              </div>
              <p className="text-2xl font-bold">154</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Histórico Recente</h2>
        <Card>
          <div className="divide-y divide-muted">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Diagnóstico de Partida Estrela-Triângulo</p>
                    <p className="text-xs text-muted-foreground">Há 2 horas • 450 XP ganhos</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Perfeito</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
