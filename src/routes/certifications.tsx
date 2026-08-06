import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/certifications")({
  component: CertificationsPage,
});

const certs = [
  { level: "Bronze", status: "Concluído", color: "text-amber-700" },
  { level: "Prata", status: "Em progresso", color: "text-gray-400" },
  { level: "Ouro", status: "Bloqueado", color: "text-yellow-500" },
  { level: "Especialista", status: "Bloqueado", color: "text-primary" },
  { level: "Mestre", status: "Bloqueado", color: "text-secondary" },
];

function CertificationsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Certificações</h1>
        <p className="text-muted-foreground">Valide seus conhecimentos técnicos</p>
      </header>

      <div className="relative space-y-8">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-muted" />
        {certs.map((c, i) => (
          <div key={c.level} className="relative flex items-center gap-8 pl-4">
            <div className={`z-10 h-6 w-6 rounded-full flex items-center justify-center border-2 border-background ${c.status === 'Concluído' ? 'bg-primary' : 'bg-muted'}`}>
              {c.status === 'Concluído' && <CheckCircle2 size={12} className="text-primary-foreground" />}
            </div>
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Award className={`h-8 w-8 ${c.color}`} />
                  <div>
                    <CardTitle>{c.level}</CardTitle>
                    <p className="text-xs text-muted-foreground">Nível Profissional</p>
                  </div>
                </div>
                <Badge variant={c.status === 'Concluído' ? 'default' : 'secondary'}>{c.status}</Badge>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
