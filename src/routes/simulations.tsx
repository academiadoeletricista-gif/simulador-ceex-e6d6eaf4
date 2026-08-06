import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, BookOpen, AlertTriangle, ArrowRight, History, Info, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cases } from "./library";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const simulationSearchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute("/simulations")({
  validateSearch: simulationSearchSchema,
  component: SimulationsPage,
});

function SimulationsPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const { sessions, startCase, completeCase, addXp, profile } = useAppStore();
  const [activeCase, setActiveCase] = useState<any>(null);

  const { cases: dbCases } = useAppStore();

  useEffect(() => {
    if (id) {
      const foundCase = dbCases.find(c => c.id === id) || cases.find(c => c.id === id);
      if (foundCase) {
        setActiveCase(foundCase);
        if (!sessions[id]) {
          startCase(id);
        }
      }
    }
  }, [id, sessions, startCase, dbCases]);

  const handleFinish = () => {
    if (activeCase) {
      completeCase(activeCase.id, true, 300); // 5 min
      addXp(activeCase.xp);
      toast.success(`Caso concluído! +${activeCase.xp} XP ganhos.`);
      navigate({ to: "/library" });
    }
  };

  if (!activeCase) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="p-8 text-center max-w-md space-y-4">
          <BookOpen size={48} className="mx-auto text-muted-foreground opacity-20" />
          <h2 className="text-2xl font-bold">Nenhuma simulação ativa</h2>
          <p className="text-muted-foreground">Selecione um caso na biblioteca para iniciar seu diagnóstico.</p>
          <Button onClick={() => navigate({ to: "/library" })}>Ir para Biblioteca</Button>
        </div>
      </div>
    );
  }

  const session = sessions[activeCase.id];
  const isCompleted = session?.status === 'completed';

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Área Esquerda: Histórico */}
      <aside className="w-64 border-r bg-card/50 overflow-y-auto hidden lg:block">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2"><History size={16} /> Histórico</h3>
        </div>
        <div className="divide-y divide-muted">
          <div className="p-4 hover:bg-muted/30 cursor-pointer transition-colors bg-primary/5">
            <p className="text-sm font-medium">Início: Recebimento do chamado</p>
            <p className="text-xs text-muted-foreground italic">Técnico chegou ao local.</p>
          </div>
          {isCompleted && (
            <div className="p-4 bg-green-500/10 border-l-2 border-green-500">
              <p className="text-sm font-medium text-green-500">Conclusão: Sucesso</p>
              <p className="text-xs text-muted-foreground">Falha identificada e corrigida.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Centro: Pergunta Atual */}
      <main className="flex-1 flex flex-col p-8 bg-background/50 relative">
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center space-y-8">
          <Badge className="bg-primary/20 text-primary border-primary/20 py-1 px-4 text-sm font-bold uppercase tracking-wider">
            {isCompleted ? "Caso Concluído" : "Fase de Diagnóstico"}
          </Badge>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">{activeCase.title}</h2>
            <p className="text-xl text-muted-foreground italic">{activeCase.description}</p>
          </div>

          <div className="grid grid-cols-1 w-full gap-4 pt-8">
            {!isCompleted ? (
              <>
                <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-primary/50 group" onClick={handleFinish}>
                  <span>Concluir Diagnóstico com Sucesso</span>
                  <CheckCircle2 className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-destructive/50 group">
                  <span>Reportar falha insolúvel</span>
                  <AlertTriangle className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={() => navigate({ to: "/library" })} className="h-16 text-lg">
                Voltar para Biblioteca
              </Button>
            )}
          </div>
        </div>

        {/* Inferior: Ações Disponíveis */}
        <footer className="mt-auto pt-8 border-t flex justify-between items-center bg-background/80 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex gap-4">
            <Button variant="ghost" className="gap-2"><BookOpen size={18} /> Ver Esquema</Button>
            <Button variant="ghost" className="gap-2"><Info size={18} /> Dica (-50 XP)</Button>
          </div>
          <Button variant="destructive" className="gap-2"><AlertTriangle size={18} /> Chamar Supervisor</Button>
        </footer>
      </main>

      {/* Direita: Painel de Informações */}
      <aside className="w-80 border-l bg-card/50 overflow-y-auto hidden xl:block p-6 space-y-6">
        <h3 className="font-semibold flex items-center gap-2"><Info size={16} /> Painel de Informações</h3>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Detalhes do Caso</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">#{activeCase.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Nível:</span>
              <span className="font-medium text-primary">{activeCase.level}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">XP em jogo:</span>
              <span className="font-medium text-secondary">{activeCase.xp}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sintomas</h4>
          <ul className="text-xs space-y-2">
            {activeCase.symptoms.map((s, i) => (
              <li key={i} className="flex gap-2 text-red-500"><AlertTriangle size={12} /> {s}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Checklist Recomendado</h4>
          <ul className="text-xs space-y-2">
            {activeCase.checklist.map((c, i) => (
              <li key={i} className="flex gap-2 text-muted-foreground"><CheckCircle2 size={12} /> {c}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
