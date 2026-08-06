import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Trophy, Medal } from "lucide-react";

export const Route = createFileRoute("/ranking")({
  component: RankingPage,
});

const players = [
  { pos: 1, name: "Eng. Ana Silva", xp: 52000, streak: 45, acc: 99.5 },
  { pos: 2, name: "Téc. João Santos", xp: 48500, streak: 38, acc: 98.2 },
  { pos: 3, name: "Eng. Pedro Oliveira", xp: 45200, streak: 32, acc: 97.8 },
  { pos: 4, name: "Eng. Carlos Alberto (Você)", xp: 42100, streak: 12, acc: 98.4 },
  { pos: 5, name: "Téc. Maria Souza", xp: 39800, streak: 21, acc: 96.5 },
];

function RankingPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Ranking Global</h1>
        <p className="text-muted-foreground">Competição entre os melhores diagnosticadores</p>
      </header>

      <Card>
        <div className="divide-y divide-muted">
          {players.map((p) => (
            <div key={p.pos} className={`flex items-center gap-4 p-6 ${p.pos === 4 ? 'bg-primary/5' : ''}`}>
              <div className={`font-bold text-lg w-8 flex items-center justify-center ${p.pos <= 3 ? 'text-primary' : ''}`}>
                {p.pos <= 3 ? <Medal size={24} /> : p.pos}
              </div>
              <div className="flex-1 font-medium">{p.name}</div>
              <div className="flex gap-8 text-sm">
                <div className="flex items-center gap-2"><Trophy size={16} className="text-primary"/> {p.xp} XP</div>
                <div className="flex items-center gap-2"><Zap size={16} className="text-primary"/> {p.streak}</div>
                <div className="flex items-center gap-2"><Target size={16} className="text-primary"/> {p.acc}%</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
