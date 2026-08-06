import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Medal, Star } from "lucide-react";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

const achievements = [
  { id: 1, title: "Primeiro Diagnóstico", desc: "Completou seu primeiro caso com sucesso", icon: Star, unlocked: true },
  { id: 2, title: "Mestre da Reversão", desc: "Completou 10 casos de reversão", icon: Award, unlocked: true },
  { id: 3, title: "Precisão Cirúrgica", desc: "Manteve precisão acima de 95% por 7 dias", icon: Trophy, unlocked: false },
  { id: 4, title: "Velocidade da Luz", desc: "Resolveu um caso avançado em menos de 5 min", icon: Medal, unlocked: false },
];

function AchievementsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Conquistas</h1>
        <p className="text-muted-foreground">Sua jornada até a maestria</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((a) => (
          <Card key={a.id} className={!a.unlocked ? "opacity-50 grayscale" : "border-primary/30"}>
            <CardHeader className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 ${a.unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <a.icon size={32} />
              </div>
              <CardTitle className="text-lg">{a.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">{a.desc}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
