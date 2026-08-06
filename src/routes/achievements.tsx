import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Shield, Zap, Target, Flame, Award, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAchievements } from "@/hooks/useAchievement";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const { data: achievementsResult, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  const achievements = achievementsResult?.success ? achievementsResult.data : [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Trophy": return <Trophy className="h-6 w-6" />;
      case "Zap": return <Zap className="h-6 w-6" />;
      case "Shield": return <Shield className="h-6 w-6" />;
      case "Star": return <Star className="h-6 w-6" />;
      case "Target": return <Target className="h-6 w-6" />;
      case "Flame": return <Flame className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conquistas</h1>
          <p className="text-muted-foreground">Seu progresso e marcos alcançados na plataforma.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Desbloqueadas</p>
            <p className="text-xl font-bold">{achievements.filter(a => a.completed).length}/{achievements.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              achievement.completed ? "border-primary/20 bg-primary/5" : "opacity-60 grayscale"
            )}
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center",
                achievement.completed ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"
              )}>
                {achievement.completed ? getIcon(achievement.icon) : <Lock size={20} />}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
                <CardDescription className="text-xs leading-none">
                  {achievement.completed ? "Conquista desbloqueada" : "Bloqueado"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                  <span>Progresso</span>
                  <span>{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-1.5" />
              </div>

              {achievement.completed && (
                <div className="pt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                    +{achievement.xpReward} XP Recompensado
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
