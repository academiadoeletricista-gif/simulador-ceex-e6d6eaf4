import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, BookOpen, AlertTriangle, ArrowRight, History, Info, CheckCircle2, Play } from "lucide-react";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import { useCase } from "@/hooks/useCase";
import { useStartSession } from "@/hooks/useSession";
import { useEffect } from "react";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { NodeType } from "@/domains/diagnosis/types/enums";

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
  
  const { data: caseResult, isLoading: caseLoading } = useCase(id || '');
  const startSessionMutation = useStartSession();
  const { state, currentNode, choices, loadCase, selectChoice, isLoading: diagnosisLoading } = useDiagnosis(id);

  useEffect(() => {
    if (caseResult?.success && caseResult.data) {
      loadCase(caseResult.data);
    }
  }, [caseResult, loadCase]);

  if (caseLoading || diagnosisLoading) {
    return <div className="p-8"><Skeleton className="w-full h-[600px]" /></div>;
  }

  const activeCase = caseResult?.success ? caseResult.data : null;

  if (!activeCase || !id) {
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

  const isCompleted = state.status === 'COMPLETED';

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Área Esquerda: Histórico */}
      <aside className="w-64 border-r bg-card/50 overflow-y-auto hidden lg:block">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2"><History size={16} /> Histórico de Ações</h3>
        </div>
        <div className="divide-y divide-muted">
          <div className="p-4 bg-primary/5">
            <p className="text-sm font-medium">Início: Recebimento do chamado</p>
            <p className="text-[10px] text-muted-foreground italic">{activeCase.description}</p>
          </div>
          {state.history.map((actionId, index) => (
            <div key={index} className="p-4 hover:bg-muted/30 transition-colors border-l-2 border-primary/20">
              <p className="text-sm font-medium">Ação #{index + 1}</p>
              <p className="text-[10px] text-muted-foreground">Executada com sucesso.</p>
            </div>
          ))}
          {isCompleted && (
            <div className="p-4 bg-green-500/10 border-l-2 border-green-500">
              <p className="text-sm font-medium text-green-500">Conclusão: Sucesso</p>
              <p className="text-xs text-muted-foreground">Falha identificada e corrigida.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Centro: Pergunta Atual (Diagnosis Engine Node) */}
      <main className="flex-1 flex flex-col p-8 bg-background/50 relative">
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center space-y-8">
          <Badge className={cn(
            "py-1 px-4 text-sm font-bold uppercase tracking-wider",
            isCompleted ? "bg-green-500/20 text-green-500 border-green-500/20" : "bg-primary/20 text-primary border-primary/20"
          )}>
            {isCompleted ? "Caso Concluído" : currentNode?.type === NodeType.START ? "Briefing Inicial" : "Fase de Diagnóstico"}
          </Badge>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">{currentNode?.title || activeCase.title}</h2>
            <p className="text-xl text-muted-foreground italic">{currentNode?.description || activeCase.description}</p>
          </div>

          <div className="grid grid-cols-1 w-full gap-4 pt-8">
            {!isCompleted ? (
              choices.map((choice) => (
                <Button 
                  key={choice.id}
                  variant="outline" 
                  className="h-16 justify-between px-6 text-lg hover:border-primary/50 group" 
                  onClick={() => selectChoice(choice.id)}
                >
                  <span className="flex items-center gap-3">
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {choice.label}
                  </span>
                  <Badge variant="secondary" className="bg-muted text-[10px]">Ação</Badge>
                </Button>
              ))
            ) : (
              <div className="space-y-6 w-full">
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-green-700">Diagnóstico Certeiro</h3>
                        <p className="text-xs text-green-600">Você ganhou {activeCase.xpReward} XP por esta conclusão.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button size="lg" onClick={() => navigate({ to: "/library" })} className="h-16 text-lg w-full">
                  Voltar para Biblioteca
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Inferior: Ações Disponíveis */}
        <footer className="mt-auto pt-8 border-t flex justify-between items-center bg-background/80 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex gap-4">
            <Button variant="ghost" className="gap-2"><BookOpen size={18} /> Ver Esquema</Button>
            <Button variant="ghost" className="gap-2"><Info size={18} /> Dica (-50 XP)</Button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Tempo Decorrido</p>
              <p className="text-sm font-mono font-bold">04:22</p>
            </div>
            <Button variant="destructive" className="gap-2"><AlertTriangle size={18} /> Chamar Supervisor</Button>
          </div>
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
              <span className="font-medium">#{activeCase.code}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Nível:</span>
              <span className="font-medium text-primary">{activeCase.level}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">XP em jogo:</span>
              <span className="font-medium text-secondary">+{activeCase.xpReward} XP</span>
            </div>
          </CardContent>
        </Card>

        {activeCase.symptoms && activeCase.symptoms.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sintomas</h4>
            <ul className="text-xs space-y-2">
              {activeCase.symptoms.map((s, i) => (
                <li key={i} className="flex gap-2 text-red-500"><AlertTriangle size={12} className="shrink-0" /> {s.description}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status da Sessão</h4>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progresso:</span>
              <span className="font-bold">{isCompleted ? '100%' : '35%'}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500", isCompleted ? "bg-green-500 w-full" : "bg-primary w-1/3")} 
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Seu progresso é salvo automaticamente a cada ação.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
