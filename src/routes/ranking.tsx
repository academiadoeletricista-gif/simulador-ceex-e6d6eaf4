import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, Star, ArrowUpRight } from "lucide-react";
import { useRanking } from "@/hooks/useRanking";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ranking")({
  component: RankingPage,
});

function RankingPage() {
  const { data: rankingResult, isLoading } = useRanking();

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const ranking = rankingResult?.success ? rankingResult.data : [];
  const topThree = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ranking Global</h1>
          <p className="text-muted-foreground">Os técnicos mais ativos e experientes da plataforma.</p>
        </div>
        <Badge variant="outline" className="h-8 gap-2">
          <Star size={14} className="text-yellow-500 fill-yellow-500" /> Atualizado em tempo real
        </Badge>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-12">
        {/* 2nd Place */}
        {topThree[1] && (
          <Card className="border-primary/20 bg-primary/5 order-2 md:order-1 h-64 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Medal size={80} />
            </div>
            <div className="relative mb-4">
              <Avatar className="h-20 w-20 border-4 border-slate-300">
                <AvatarImage src={topThree[1].avatar_url} />
                <AvatarFallback>{topThree[1].full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-slate-300 text-slate-800 font-bold rounded-full h-8 w-8 flex items-center justify-center text-sm shadow-lg">2</div>
            </div>
            <h3 className="font-bold text-lg">{topThree[1].full_name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{topThree[1].role}</p>
            <Badge variant="secondary" className="font-mono">{topThree[1].xp.toLocaleString()} XP</Badge>
          </Card>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <Card className="border-yellow-500/50 bg-yellow-500/5 order-1 md:order-2 h-80 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Crown size={100} />
            </div>
            <div className="relative mb-4 scale-110">
              <Avatar className="h-24 w-24 border-4 border-yellow-500">
                <AvatarImage src={topThree[0].avatar_url} />
                <AvatarFallback>{topThree[0].full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-yellow-900 font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg shadow-lg animate-bounce">1</div>
            </div>
            <h3 className="font-black text-xl">{topThree[0].full_name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{topThree[0].role}</p>
            <Badge className="bg-yellow-500 text-yellow-950 font-mono text-lg py-1 px-4">
              {topThree[0].xp.toLocaleString()} XP
            </Badge>
          </Card>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <Card className="border-orange-500/20 bg-orange-500/5 order-3 h-56 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={60} />
            </div>
            <div className="relative mb-3">
              <Avatar className="h-16 w-16 border-4 border-orange-400">
                <AvatarImage src={topThree[2].avatar_url} />
                <AvatarFallback>{topThree[2].full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-orange-400 text-orange-950 font-bold rounded-full h-6 w-6 flex items-center justify-center text-xs shadow-lg">3</div>
            </div>
            <h3 className="font-bold">{topThree[2].full_name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{topThree[2].role}</p>
            <Badge variant="secondary" className="font-mono text-xs">{topThree[2].xp.toLocaleString()} XP</Badge>
          </Card>
        )}
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Todos os Candidatos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {rest.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 font-mono text-muted-foreground font-bold">{user.rank}</span>
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Nível</p>
                    <p className="font-bold text-primary">{user.level}</p>
                  </div>
                  <div className="text-right w-24">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Total XP</p>
                    <p className="font-mono font-bold">{user.xp.toLocaleString()}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-muted-foreground opacity-20" />
                </div>
              </div>
            ))}
            {rest.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                Nenhum outro usuário encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
