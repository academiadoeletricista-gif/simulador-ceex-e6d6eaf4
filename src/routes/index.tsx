// SPRINT CORE-REBUILD-01: ScenarioRuntime + PD-001 Functional Diagnostic
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getLevelTitle } from "@/store/useAppStore";
import { useProfile } from "@/hooks/useProfile";
import { useSessions } from "@/hooks/useSession";
import { useCases } from "@/hooks/useCase";
import { useLaboratory, useLaboratories } from "@/hooks/useLaboratory";
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
  
  const recommendedLab = laboratories.find(l => l.progress < 100) || laboratories[0];
  const recommendedCase = allCases.find(c => !sessionsMap[c.id] || sessionsMap[c.id]?.status !== 'completed') || allCases[0];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      <section className="relative overflow-hidden rounded-3xl bg-card border shadow-sm p-8 md:p-12">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 uppercase tracking-wider text-[10px]">
                Área do Aluno
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Olá, <span className="text-primary">{userName.split(' ')[0]}</span>
              </h1>
            </div>
            
            <p className="text-muted-foreground text-lg max-w-xl">
              Você tem <span className="text-foreground font-bold">{recommendedLab?.defectCount || 0} casos</span> pendentes no laboratório <span className="text-foreground font-bold">{recommendedLab?.name}</span>. Vamos resolver?
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
              <Button size="lg" className="rounded-xl px-8 h-14 text-lg font-bold gap-3 shadow-lg shadow-primary/20 group" onClick={() => navigate({ to: '/library' })}>
                Continuar de onde parei
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-sm bg-background/50 backdrop-blur-sm border-primary/10 shadow-xl overflow-hidden shrink-0">
            <div className="h-1 bg-primary w-full" />
            <CardContent className="pt-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{levelTitle}</p>
                  <p className="text-3xl font-black">Nível {level}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-muted-foreground">Progresso do Nível</span>
                  <span className="text-primary">{Math.round(xpProgress)}%</span>
                </div>
                <Progress value={xpProgress} className="h-2.5 bg-primary/10" />
                <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest">
                  Faltam {nextLevelXp - (xp % nextLevelXp)} XP para o próximo nível
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Precisão</p>
                  <p className="text-2xl font-black text-foreground">{accuracy}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">XP Total</p>
                  <p className="text-2xl font-black text-primary">{xp.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
                          <p className="text-xs text-muted-foreground">{recommendedLab.defectCount} Casos disponíveis</p>
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
                <CardDescription>Você já desbloqueou {achievements.filter(a => a.completed).length} de {achievements.length} conquistas.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {achievements.slice(0, 4).map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                        achievement.completed ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 scale-110 shadow-lg shadow-yellow-500/10" : "bg-muted text-muted-foreground opacity-40"
                      )}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                  ))}
                  {achievements.length > 4 && (
                    <div className="w-10 h-10 rounded-full border bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      +{achievements.length - 4}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

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
                              {new Date(session.start_time).toLocaleDateString()}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {session.status === 'completed' ? 500 : 0} XP
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

        <div className="space-y-8">
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
