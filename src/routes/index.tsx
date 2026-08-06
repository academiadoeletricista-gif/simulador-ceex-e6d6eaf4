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
              Execute esta instrucao no projeto: Realize uma nova auditoria tecnica
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
