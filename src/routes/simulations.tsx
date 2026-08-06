import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, BookOpen, AlertTriangle, ArrowRight, History, Info, CheckCircle2, Play, Settings2, Activity } from "lucide-react";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import { useCase } from "@/hooks/useCase";
import { useStartSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
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
  const { state, loadCase, selectChoice, measure, isLoading: diagnosisLoading } = useDiagnosis(id);
  const [multimeterValue, setMultimeterValue] = useState<number | null>(null);

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
          {state.history.map((action: any, index: number) => (
            <div key={index} className="p-4 hover:bg-muted/30 transition-colors border-l-2 border-primary/20">
              <p className="text-sm font-medium">{action.action}</p>
              <p className="text-[10px] text-muted-foreground">{action.result || 'Ação executada.'}</p>
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

      {/* Centro: Simulador Elétrico Real */}
      <main className="flex-1 flex flex-col p-6 bg-background/50 relative overflow-hidden">
        <div className="flex-1 flex flex-col space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Badge className={cn(
                "py-0.5 px-3 text-[10px] font-bold uppercase tracking-wider",
                isCompleted ? "bg-green-500/20 text-green-500 border-green-500/20" : "bg-primary/20 text-primary border-primary/20"
              )}>
                {isCompleted ? "Caso Concluído" : "Simulação de Física Elétrica"}
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">{activeCase.title}</h2>
              <p className="text-sm text-muted-foreground italic">Identifique a falha elétrica através de medições e inspeções.</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("gap-1.5", state.isMotorRunning ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20")}>
                <Activity size={12} className={cn(state.isMotorRunning && "animate-pulse")} />
                Motor: {state.isMotorRunning ? "EM OPERAÇÃO" : "PARADO"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Componentes do Painel */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-sm flex items-center gap-2"><Settings2 size={16} /> Componentes do Painel</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {state.components.map((comp: any) => (
                  <div key={comp.id} className="p-3 border rounded-lg bg-card/30 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-primary">{comp.id}</span>
                      <Badge variant="secondary" className="text-[8px] py-0">{comp.type}</Badge>
                    </div>
                    <div className="text-xs font-medium truncate">{comp.id === 'K1' ? 'Contator de Potência' : comp.id === 'F1' ? 'Fusível' : comp.id === 'S2' ? 'Botão START' : comp.id}</div>
                    
                    <div className="flex gap-1 mt-auto">
                      {comp.id === 'S2' && (
                        <Button 
                          size="sm" 
                          className="w-full text-[10px] h-7"
                          onMouseDown={async () => {
                            (engine as any).performAction('PRESS_START');
                            await selectChoice('PRESS_START');
                          }}
                          onMouseUp={async () => {
                            (engine as any).performAction('RELEASE_START');
                            await selectChoice('RELEASE_START');
                          }}
                        >
                          Pressionar
                        </Button>
                      )}
                      {comp.type !== 'POWER_SUPPLY' && comp.type !== 'MOTOR' && comp.id !== 'S2' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full text-[10px] h-7"
                          onClick={async () => {
                            (engine as any).performAction('REPLACE_COMPONENT', { id: comp.id });
                            await selectChoice('REPLACE_COMPONENT');
                          }}
                        >
                          Substituir
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Multímetro / Medições */}
            <Card>
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-sm flex items-center gap-2"><Zap size={16} /> Multímetro Digital</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="bg-black/90 p-4 rounded-lg border-2 border-primary/20 flex flex-col items-center justify-center min-h-[100px]">
                  <span className="text-[10px] text-primary/50 font-mono mb-1">VAC - TRUE RMS</span>
                  <div className="text-4xl font-mono text-primary animate-pulse">
                    {multimeterValue !== null ? `${multimeterValue}.0` : "---.-"}
                  </div>
                  <span className="text-[10px] text-primary/50 font-mono mt-1">VOLTS</span>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Pontos de Medição (Comando)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['L1-N', 'L1-n1', 'n1-n2', 'n2-n3', 'n3-n4', 'n4-N'].map(pair => (
                      <Button 
                        key={pair}
                        size="sm" 
                        variant="outline" 
                        className="text-[10px] h-8"
                        onClick={async () => {
                          const [n1, n2] = pair.split('-');
                          const result = (engine as any).performAction('MEASURE_VOLTAGE', { node1: n1, node2: n2 });
                          const vMatch = result.match(/\d+/);
                          const v = vMatch ? parseInt(vMatch[0]) : 0;
                          setMultimeterValue(v);
                          await selectChoice('MEASURE_VOLTAGE');
                        }}
                      >
                        {pair}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isCompleted && (
            <Card className="bg-green-500/5 border-green-500/20 animate-in fade-in zoom-in duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-700">Circuito Restaurado com Sucesso</h3>
                    <p className="text-sm text-green-600">A falha foi identificada e o motor está em operação normal.</p>
                  </div>
                </div>
                <Button size="lg" onClick={() => navigate({ to: "/library" })} className="bg-green-600 hover:bg-green-700">
                  Concluir Diagnóstico
                </Button>
              </CardContent>
            </Card>
          )}
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
