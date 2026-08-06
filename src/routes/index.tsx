import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getLevelTitle } from "@/store/useAppStore";
import { useProfile } from "@/hooks/useProfile";
import { useSessions } from "@/hooks/useSession";
import { useCases } from "@/hooks/useCase";
import { useLaboratories } from "@/hooks/useLaboratory";
import { useAchievements } from "@/hooks/useAchievement";
import { 
  Zap, 
  Clock, 
  Target, 
  Trophy, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  Star,
  BookOpen,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  
  const { data: profileResult, isLoading: profileLoading } = useProfile();
  const { data: sessionsResult, isLoading: sessionsLoading } = useSessions();
  const { data: achievementsResult, isLoading: achievementsLoading } = useAchievements();
  const { data: casesResult, isLoading: casesLoading } = useCases();
  const { data: laboratoriesResult, isLoading: labsLoading } = useLaboratories();

  const isLoading = profileLoading || sessionsLoading || achievementsLoading || casesLoading || labsLoading;

  if (isLoading) {
    return <div className="p-8 space-y-8 max-w-7xl mx-auto"><Skeleton className="w-full h-[400px]" /></div>;
  }

  const profile = profileResult?.success ? profileResult.data : null;
  const sessions = sessionsResult?.success ? sessionsResult.data : [];
  const achievements = achievementsResult?.success ? achievementsResult.data : [];
  const allCases = casesResult?.success ? casesResult.data : [];
  const laboratories = laboratoriesResult?.success ? laboratoriesResult.data : [];

  const sessionsMap = sessions.reduce((acc, s) => {
    acc[s.case_id] = s;
    return acc;
  }, {} as Record<string, any>);

  const userName = profile?.full_name || "Comandante";
  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const streakCount = profile?.streak_current || 0;
  const levelTitle = getLevelTitle(level);
  const nextLevelXp = 1000;
  const dailyChallenges = [
    { id: 'd1', title: 'Completar 2 diagnósticos', description: 'Realize dois diagnósticos completos hoje', xpReward: 200, completed: false },
    { id: 'd2', title: 'Precisão > 90% em caso Prata', description: 'Mantenha alta precisão em um caso de nível Prata', xpReward: 500, completed: false },
  ];
  const accuracy = profile?.accuracy || 0;
  const avgTime = profile?.avg_time || 0;

  const xpProgress = (xp / nextLevelXp) * 100;
  
  // Encontrar um laboratório com progresso pendente
  const recommendedLab = laboratories.find(l => l.progress < 100) || laboratories[0];
  
  // Encontrar um caso não concluído como recomendação
  const recommendedCase = allCases.find(c => !sessionsMap[c.id] || sessionsMap[c.id]?.status !== 'completed') || allCases[0];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Hero Welcome & Progress */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/5 border p-8 md:p-12">
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 text-center md:text-left">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
              Painel de Controle do Especialista
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Bem-vindo, <span className="text-primary">{userName}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto md:mx-0">
              Sua jornada para se tornar uma lenda industrial continua. Analise casos, realize medições e resolva defeitos complexos.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <Button size="lg" className="rounded-full px-8 gap-2 group" onClick={() => navigate({ to: '/library' })}>
                Iniciar Novo Diagnóstico
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 gap-2" onClick={() => navigate({ to: '/ranking' })}>
                Ver Ranking Global
                <Trophy className="w-4 h-4 text-yellow-500" />
              </Button>
            </div>
          </div>

          <div className="w-full max-w-md space-y-6">
            <Card className="bg-background/40 backdrop-blur-sm border-primary/10">
              <CardContent className="pt-6 space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{levelTitle}</p>
                    <p className="text-2xl font-bold">Nível {level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XP Total</p>
                    <p className="text-2xl font-bold text-primary">{xp.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso para Nível {level + 1}</span>
                    <span className="font-medium">{Math.round(xpProgress)}%</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                  <p className="text-[10px] text-center text-muted-foreground">Faltam {nextLevelXp - (xp % nextLevelXp)} XP para o próximo nível</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 text-primary">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-bold">Precisão</span>
                    </div>
                    <p className="text-xl font-bold">{accuracy}%</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-2xl bg-secondary/5 border border-secondary/10">
                    <div className="flex items-center gap-2 text-secondary-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold">Tempo Médio</span>
                    </div>
                    <p className="text-xl font-bold">{avgTime}m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions / Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative" onClick={() => navigate({ to: '/library' })}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-24 h-24" />
              </div>
              <CardHeader>
                <Badge className="w-fit mb-2">Recomendado</Badge>
                <CardTitle>Continuar Aprendizado</CardTitle>
                <CardDescription>Explore os laboratórios virtuais e domine novos comandos.</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedLab ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50 border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{recommendedLab.name}</p>
                          <p className="text-xs text-muted-foreground">{recommendedLab.cases_count} Casos disponíveis</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 group">
                      Acessar Laboratório
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-[100px] flex items-center justify-center text-muted-foreground italic text-sm">
                    Nenhum laboratório disponível no momento.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="group hover:border-secondary/50 transition-all cursor-pointer overflow-hidden relative" onClick={() => navigate({ to: '/achievements' })}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="w-24 h-24" />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">Conquistas</Badge>
                <CardTitle>Suas Medalhas</CardTitle>
                <CardDescription>Você já desbloqueou {achievements.filter(a => a.unlocked_at).length} de {achievements.length} conquistas.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {achievements.slice(0, 4).map((achievement, i) => (
                    <div 
                      key={achievement.id} 
                      className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                        achievement.unlocked_at ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 scale-110 shadow-lg shadow-yellow-500/10" : "bg-muted text-muted-foreground opacity-40"
                      )}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    +{Math.max(0, achievements.length - 4)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed / Recent Sessions */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Atividade Recente
              </h2>
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate({ to: '/simulations' })}>
                Ver Histórico Completo
              </Button>
            </div>

            <div className="space-y-3">
              {sessions.length > 0 ? (
                sessions.slice(0, 5).map((session) => {
                  const sessionCase = allCases.find(c => c.id === session.case_id);
                  return (
                    <div key={session.id} className="p-4 rounded-2xl border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          session.status === 'completed' ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                        )}>
                          {session.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold">{sessionCase?.title || "Caso Industrial"}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(session.updated_at).toLocaleDateString()}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {session.xp_earned || 0} XP
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate({ to: `/simulation/${session.id}` })}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border rounded-2xl border-dashed bg-muted/20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-lg">Inicie sua jornada</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                    Você ainda não realizou nenhuma simulação. Vá até a biblioteca para começar.
                  </p>
                  <Button className="mt-6 rounded-full" onClick={() => navigate({ to: '/library' })}>
                    Ir para Biblioteca
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Daily Missions */}
          <Card className="border-primary/20 bg-primary/5 overflow-hidden">
            <div className="h-1 bg-primary w-full" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Missões Diárias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyChallenges.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-bold">{challenge.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{challenge.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-background text-primary text-[10px] shrink-0">
                      +{challenge.xpReward} XP
                    </Badge>
                  </div>
                  <Progress value={challenge.completed ? 100 : 0} className="h-1.5" />
                </div>
              ))}
              <p className="text-[10px] text-center text-muted-foreground pt-2">Atualiza em 14h 22m</p>
            </CardContent>
          </Card>

          {/* Ranking Preview */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Ranking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: "Carlos Silva", xp: 15420, pos: 1, avatar: "CS" },
                  { name: "Ana Oliveira", xp: 12850, pos: 2, avatar: "AO" },
                  { name: "Marcos Paulo", xp: 11200, pos: 3, avatar: "MP" }
                ].map((user) => (
                  <div key={user.pos} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                        user.pos === 1 ? "bg-yellow-500/20 text-yellow-700 border border-yellow-500/30" : 
                        user.pos === 2 ? "bg-slate-300/20 text-slate-600 border border-slate-300/30" : 
                        "bg-amber-600/20 text-amber-700 border border-amber-600/30"
                      )}>
                        {user.avatar}
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <span className="text-xs font-bold">{user.xp} XP</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate({ to: '/ranking' })}>
                Ver Ranking Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


The engine MUST continuously update possible hypotheses.

Hypotheses MUST NEVER reveal the solution.

They only guide reasoning.

Wrong hypotheses must disappear.

Correct hypotheses become stronger as evidence accumulates.

---

# STEP 10

## CASE COMPLETION

A case may only finish after:

Root cause identified

Corrective action executed

Machine tested

Operation restored

Validation successful

Only then may the session close.

---

# STEP 11

## FINAL REPORT

Generate automatically:

Root cause

Corrective action

Investigation timeline

Measurements taken

Evidence collected

Wrong decisions

Correct decisions

Elapsed time

Accuracy

XP earned

Technical explanation

Lessons learned

Store everything in Supabase.

---

# STEP 12

## DASHBOARD UPDATE

Immediately after completion:

Update XP

Update completed cases

Update statistics

Update accuracy

Update average completion time

Update recent activity

Update achievements (if applicable)

No manual refresh.

---

# DATA FLOW

The following architecture is mandatory:

React UI

↓

Hooks

↓

Services

↓

Diagnosis Engine

↓

Repositories

↓

Supabase

↓

Database

React components MUST NEVER access Supabase directly.

---

# ERROR HANDLING

If any required entity is missing:

Display a descriptive error.

Never freeze.

Never show blank screens.

Never silently fail.

---

# REMOVE LEGACY CODE

Completely remove any dependency on:

public.cases

Legacy stores

Legacy services

Mock arrays

Placeholder simulations

Temporary diagnostic logic

Old repositories

Deprecated components

There must be only one implementation path.

---

# ACCEPTANCE TEST

The implementation is only accepted if a brand-new user can execute the following flow without developer intervention:

Register

↓

Login

↓

Library

↓

Open Direct-On-Line Starter Laboratory

↓

Select Case PD-001

↓

Start Diagnostic Session

↓

Perform multiple inspections

↓

Perform multiple measurements

↓

Receive dynamic responses

↓

Identify the real fault

↓

Repair the circuit

↓

Validate machine operation

↓

Finish the session

↓

Receive the technical report

↓

Return to Dashboard

↓

See updated statistics

Every step MUST work.

---

# FINAL AUDIT

Generate a technical report answering:

Can a user start a diagnostic session?

YES / NO

Can a user continue a previous session?

YES / NO

Does the Diagnosis Engine control the simulation?

YES / NO

Are measurements dynamic?

YES / NO

Are actions persisted?

YES / NO

Does page refresh preserve progress?

YES / NO

Does the Dashboard update automatically?

YES / NO

Are there any remaining mock simulations?

YES / NO

Are there any legacy diagnostic flows?

YES / NO

Is the CEEX diagnostic simulator now fully operational?

YES / NO

---

# ACCEPTANCE CRITERIA

This Sprint is approved ONLY if:

✔ Every button required for a simulation works.

✔ A diagnostic session can always be created.

✔ Every user action changes the simulation state.

✔ Measurements are generated dynamically.

✔ Sessions are fully persisted.

✔ Refreshing the browser never loses progress.

✔ The Diagnosis Engine controls the complete workflow.

✔ The final report is generated automatically.

✔ No mock simulation remains anywhere in the application.

✔ The CEEX platform now contains one fully functional production-ready diagnostic simulation.
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Bom trabalho, <span className="text-primary">{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Você está a apenas {nextLevelXp - xp} XP do próximo nível. Continue sua jornada para se tornar uma <span className="text-foreground font-semibold">Lenda Industrial</span>.
            </p>
          </div>

          <Card className="w-full md:w-80 bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nível Atual</p>
                  <p className="text-2xl font-bold text-primary">{level}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{levelTitle}</p>
                  <p className="text-sm font-semibold">{xp} / {nextLevelXp} XP</p>
                </div>
              </div>
              <Progress value={xpProgress} className="h-3 bg-primary/10" />
              <p className="text-[10px] text-center text-muted-foreground italic">
                Sua evolução é constante • {accuracy}% de Precisão Global
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card/40 border-none shadow-none">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Sequência
                </CardDescription>
                <CardTitle className="text-3xl">{streakCount} dias</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/40 border-none shadow-none">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-secondary" /> Precisão
                </CardDescription>
                <CardTitle className="text-3xl">{accuracy}%</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/40 border-none shadow-none">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Tempo Médio
                </CardDescription>
                <CardTitle className="text-3xl">{(avgTime / 60).toFixed(1)} min</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Recommendation Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured Laboratory */}
            {recommendedLab && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> 
                  Laboratório Sugerido
                </h2>
                <Card className="group overflow-hidden border-2 bg-card hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate({ to: `/library/${recommendedLab.id}` })}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="font-mono text-[10px] uppercase border-2">{recommendedLab.code}</Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">{recommendedLab.level}</Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{recommendedLab.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{recommendedLab.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-muted-foreground">Seu Progresso</span>
                        <span>{recommendedLab.progress}%</span>
                      </div>
                      <Progress value={recommendedLab.progress} className="h-1.5" />
                    </div>
                    <Button variant="ghost" className="w-full h-8 text-xs p-0 group-hover:gap-3 transition-all">
                      Acessar Laboratório <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Featured Case */}
            {recommendedCase && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> 
                  Próximo Desafio
                </h2>
                <Card className="group overflow-hidden border-2 bg-card hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate({ to: '/simulations', search: { id: recommendedCase.id } })}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="font-mono text-[10px] uppercase border-2">{recommendedCase.code}</Badge>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary">{recommendedCase.level}</Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{recommendedCase.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{recommendedCase.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> +{recommendedCase.xpReward} XP</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recommendedCase.timeEstimate}</span>
                    </div>
                    <Button variant="ghost" className="w-full h-8 text-xs p-0 group-hover:gap-3 transition-all">
                      Iniciar Diagnóstico <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>


          {/* Daily Challenges */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> 
                Missões Diárias
              </h2>
            </div>
            <div className="grid gap-3">
              {dailyChallenges.map((challenge) => (
                <Card key={challenge.id} className={cn(
                  "border-none bg-accent/30 transition-all hover:bg-accent/50",
                  challenge.completed && "opacity-60"
                )}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border",
                        challenge.completed ? "bg-green-500/20 border-green-500/20 text-green-500" : "bg-primary/10 border-primary/10 text-primary"
                      )}>
                        {challenge.completed ? <CheckCircle2 className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{challenge.title}</h4>
                        <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">+{challenge.xpReward} XP</p>
                      {challenge.completed && <p className="text-[10px] text-green-500 font-medium">CONCLUÍDO</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar/Ranking Column */}
        <div className="space-y-8">
          {/* Next Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" /> Próximas Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {achievements.filter(a => !a.completed).slice(0, 3).map((ach) => (
                <div key={ach.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{ach.title}</span>
                    <span className="text-muted-foreground">{ach.progress}/{ach.maxProgress}</span>
                  </div>
                  <Progress value={(ach.progress / ach.maxProgress) * 100} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground">{ach.description}</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs h-8 text-primary" asChild>
                <Link to="/achievements">Ver todas as conquistas</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Ranking Snapshot */}
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Ranking da Semana
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                {[
                  { pos: 1, name: "Eng. Roberto M.", xp: "4,200", trend: "up" },
                  { pos: 2, name: userName, xp: xp.toLocaleString(), trend: "none", current: true },
                  { pos: 3, name: "Mariana S.", xp: "2,100", trend: "down" },
                ].map((user) => (
                  <div key={user.name} className={cn(
                    "flex items-center justify-between p-2 rounded-lg",
                    user.current && "bg-primary/10 border border-primary/20"
                  )}>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-bold w-4",
                        user.pos === 1 && "text-yellow-500",
                        user.pos === 2 && "text-gray-400",
                        user.pos === 3 && "text-amber-700"
                      )}>{user.pos}º</span>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <span className="text-xs font-bold">{user.xp} XP</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-xs h-8" asChild>
                <Link to="/ranking">Ver ranking completo</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
