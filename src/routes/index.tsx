import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { Zap, Clock, Target, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { xp, level, streak, levelTitle, nextLevelXp, dailyChallenges, achievements } = useAppStore();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao Laboratório de Diagnóstico em Comandos Elétricos</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full font-medium border border-secondary/20">
            <Zap className="h-5 w-5" />
            <span>Nível {level}</span>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium border border-primary/20">
            <Award className="h-5 w-5" />
            <span>{xp} XP</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência Diária</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streak.current} dias</div>
            <p className="text-xs text-muted-foreground mt-1">Continue mantendo o foco!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground mt-1">Baseado nos últimos 50 diagnósticos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2 min</div>
            <p className="text-xs text-muted-foreground mt-1">Diagnóstico rápido e eficiente</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Case */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recomendação do Dia</h2>
        <Card className="flex flex-col md:flex-row overflow-hidden border-none bg-card/50">
          <div className="w-full md:w-1/3 bg-muted/20 p-8 flex items-center justify-center">
            <div className="text-6xl animate-pulse">⚡</div>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center gap-6">
            <div>
              <h3 className="text-2xl font-bold">Diagnóstico de Partida Estrela-Triângulo</h3>
              <p className="text-muted-foreground mt-2 max-w-lg">Identifique falhas comuns no contator principal e no temporizador eletrônico em sistemas de partida de motores trifásicos.</p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="gap-2">Iniciar Diagnóstico <ArrowRight className="h-4 w-4" /></Button>
              <Button variant="outline" size="lg">Ver Biblioteca</Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
