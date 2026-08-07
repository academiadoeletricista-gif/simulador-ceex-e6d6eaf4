import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Zap, 
  BookOpen, 
  AlertTriangle, 
  ArrowRight, 
  History, 
  Info, 
  CheckCircle2, 
  Settings2, 
  Activity,
  FileText,
  Search,
  Hammer,
  HelpCircle,
  RefreshCcw,
  Layers,
  ArrowLeft
} from "lucide-react";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import { useCase } from "@/hooks/useCase";
import { useStartSession } from "@/hooks/useSession";
import { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  const { data: caseResult, isLoading: caseLoading, error: caseError } = useCase(id || '');
  const { state, loadCase, selectChoice, useHint, isLoading: diagnosisLoading, isError, sessionError } = useDiagnosis(id);
  const [showDiagram, setShowDiagram] = useState(false);
  const [activeTab, setActiveTab] = useState<'work-order' | 'investigation' | 'report'>('work-order');
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (caseResult?.success && caseResult.data) {
      loadCase(caseResult.data);
    }
  }, [caseResult, loadCase]);

  // Loading state
  if (caseLoading || diagnosisLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <Activity size={48} className="text-primary animate-pulse" />
        <p className="text-muted-foreground animate-pulse font-mono uppercase text-xs tracking-widest">Iniciando cenário de diagnóstico...</p>
      </div>
    );
  }

  const activeCase = caseResult?.success ? caseResult.data : null;
  const anyError = isError || !caseResult?.success || !!caseError || !!sessionError;

  // Waiting for state initialization after case is loaded
  if (activeCase && !anyError && !state) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <Activity size={48} className="text-primary animate-pulse" />
        <p className="text-muted-foreground animate-pulse font-mono uppercase text-xs tracking-widest">Preparando cenário...</p>
      </div>
    );
  }

  // Error handling
  if (!activeCase || !id || anyError || !state) {
    const errorDetail = state?.error || (caseResult && !caseResult.success ? caseResult.error.message : null) || sessionError || caseError?.message;
    
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4 p-8">
        <div className="text-center max-w-md space-y-6">
          <div className="bg-red-500/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 border-2 border-red-500/20">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Erro ao carregar sessão</h2>
            <p className="text-muted-foreground text-sm">
              Houve um problema ao carregar os dados do seu cenário. Certifique-se de que o laboratório foi iniciado corretamente.
            </p>
          </div>
          
          {errorDetail && (
            <div className="text-[10px] bg-card p-4 rounded-lg font-mono text-red-400 border border-red-500/20 text-left overflow-auto max-h-32">
              <p className="font-bold uppercase mb-1 opacity-50">Debug info:</p>
              {errorDetail}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button size="lg" className="w-full font-bold uppercase italic" onClick={() => window.location.reload()}>
              <RefreshCcw size={18} className="mr-2" /> Tentar Novamente
            </Button>
            <Button variant="outline" size="lg" className="w-full font-bold uppercase italic" onClick={() => navigate({ to: "/library" })}>
              <ArrowLeft size={18} className="mr-2" /> Voltar para Biblioteca
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = state.status === 'COMPLETED';

  // Find current decision node
  const currentNode = (activeCase as any).decisionTree?.find((n: any) => n.id === state.currentNodeId) || 
                     (activeCase as any).decisionTree?.[0];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Header Bar */}
      <div className="border-b bg-card px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/library" })} className="gap-2">
             <ArrowLeft size={16} /> Voltar
           </Button>
           <div className="h-6 w-px bg-muted" />
           <div>
             <h2 className="text-sm font-bold uppercase tracking-tight">{activeCase.title}</h2>
             <p className="text-[10px] text-muted-foreground font-mono">CODE: {activeCase.code}</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <Badge variant="outline" className="font-mono text-[10px] bg-primary/5">{state.xp} XP</Badge>
           <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => window.location.reload()}>
             <RefreshCcw size={14} /> Reiniciar
           </Button>
           <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => setShowDiagram(true)}>
             <BookOpen size={14} /> Diagrama
           </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Navigation & Hypotheses */}
        <aside className="w-80 border-r bg-card/30 flex flex-col p-6 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <Layers size={12} /> Fluxo de Trabalho
            </h3>
            <div className="space-y-2">
              {[
                { id: 'work-order', label: 'Ordem de Serviço', icon: FileText },
                { id: 'investigation', label: 'Investigação Técnica', icon: Search },
                { id: 'report', label: 'Relatório Final', icon: CheckCircle2, disabled: !isCompleted }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  disabled={tab.disabled}
                  className={cn(
                    "w-full justify-start gap-3 text-sm h-11 transition-all",
                    activeTab === tab.id ? "bg-primary/10 text-primary border-l-2 border-primary rounded-l-none" : ""
                  )}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <tab.icon size={16} /> {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Hypotheses Panel */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <Settings2 size={12} /> Painel de Hipóteses
            </h3>
            <div className="space-y-4">
              {state.currentHypotheses.length > 0 ? (
                state.currentHypotheses.map((h) => (
                  <div key={h.id} className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold truncate max-w-[140px]">{h.label}</span>
                      <span className="font-mono text-primary">{h.confidence}%</span>
                    </div>
                    <Progress value={h.confidence} className="h-1" />
                  </div>
                ))
              ) : (
                <p className="text-[10px] italic text-muted-foreground">Colete evidências para gerar hipóteses.</p>
              )}
            </div>
          </div>

          {/* History */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <History size={12} /> Log de Ações
            </h3>
            <div className="space-y-3">
              {state.history.slice(-5).reverse().map((h, i) => (
                <div key={i} className="text-[10px] border-l-2 border-muted pl-3 py-1">
                  <p className="font-bold truncate">{h.description}</p>
                  <p className="text-muted-foreground">{new Date(h.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-background relative overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full p-8 space-y-8">
            {activeTab === 'work-order' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-black italic text-primary">ORDEM DE SERVIÇO</CardTitle>
                      <Badge variant="destructive" className="uppercase tracking-tighter">Prioridade Máxima</Badge>
                    </div>
                    <CardDescription>Manutenção Corretiva Industrial</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Cliente</p>
                        <p className="font-medium">{(activeCase as any).workOrder?.customer || 'Planta Industrial Alpha'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Máquina</p>
                        <p className="font-medium">{(activeCase as any).workOrder?.machine || activeCase.title}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Data/Hora</p>
                        <p className="font-medium font-mono">{new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    <div className="p-5 bg-background rounded-lg border-2 border-primary/10 space-y-3">
                      <h4 className="text-sm font-bold flex items-center gap-2"><AlertTriangle size={16} className="text-primary" /> Sintomas Relatados pelo Operador:</h4>
                      <p className="text-lg italic text-muted-foreground leading-relaxed">
                        "{(activeCase as any).workOrder?.symptoms || activeCase.description}"
                      </p>
                    </div>

                    <div className="p-5 bg-background rounded-lg border space-y-3">
                      <h4 className="text-sm font-bold">Guia de Procedimentos:</h4>
                      <div className="space-y-4">
                        {currentNode?.steps ? (
                          currentNode.steps.map((step: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-start">
                              <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-bold">{step.situation}</p>
                                <p className="text-xs text-muted-foreground">{step.correct}</p>
                                {step.reading && (
                                  <Badge variant="outline" className="mt-1 font-mono text-[10px]">Leitura: {step.reading}</Badge>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex gap-4 items-start">
                            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              1
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold">Inicie a investigação técnica</p>
                              <p className="text-xs text-muted-foreground">Analise o painel e realize as medições necessárias para isolar a falha.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button size="lg" className="w-full h-14 text-lg gap-3" onClick={() => setActiveTab('investigation')}>
                      Aceitar Chamado e Iniciar Diagnóstico <ArrowRight size={20} />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'investigation' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold flex items-center gap-3">
                     <Search className="text-primary" /> Estágio de Investigação
                   </h2>
                   <Badge variant="outline" className="font-mono">{state.collectedEvidence.length} Evidências</Badge>
                </div>

                {/* Scenario Node Context */}
                {currentNode && (
                  <Card className="border-primary shadow-xl overflow-hidden ring-4 ring-primary/5">
                    <CardHeader className="bg-primary/5 border-b py-4">
                      <div className="flex justify-between items-center">
                         <CardTitle className="text-sm flex items-center gap-2"><Activity size={16} className="text-primary animate-pulse" /> Decisão em Aberto</CardTitle>
                         <span className="text-[10px] font-mono text-muted-foreground">ID: {currentNode.id}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <p className="text-2xl font-bold leading-tight text-foreground">{currentNode.situation || 'O que você deseja fazer em seguida?'}</p>
                      
                      <div className="grid gap-3 pt-4">
                         {currentNode.options?.map((option: any, i: number) => (
                           <Button 
                             key={i} 
                             variant="outline" 
                             className="justify-start text-left h-auto py-5 px-6 hover:bg-primary/5 hover:border-primary/50 transition-all border-2 group"
                             onClick={() => {
                               if (option.consequence) setLastMessage(option.consequence);
                               selectChoice(option.nextNodeId || currentNode.id, { xp: option.xpReward });
                             }}
                           >
                             <span className="h-8 w-8 rounded-full border-2 border-muted flex items-center justify-center mr-6 text-xs font-black text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                               {String.fromCharCode(65 + i)}
                             </span>
                             <div>
                               <p className="font-bold text-lg">{option.label}</p>
                               {option.detail && <p className="text-xs text-muted-foreground mt-0.5">{option.detail}</p>}
                             </div>
                           </Button>
                         ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {lastMessage && (
                  <div className="p-6 bg-red-500/10 border-2 border-red-500/20 rounded-xl text-red-600 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-xs uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={16} /> Consequência Técnica</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-500/20" onClick={() => setLastMessage(null)}>×</Button>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{lastMessage}</p>
                  </div>
                )}

                {/* Collected Evidence Display */}
                {state.collectedEvidence.length > 0 && (
                   <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Evidências Coletadas</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {state.collectedEvidence.map((e, i) => (
                         <Card key={i} className="border-2 border-muted/50">
                           <CardContent className="p-4 flex gap-4 items-center">
                             <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                               {e.type === 'visual' ? <Search size={20} /> : <Zap size={20} />}
                             </div>
                             <div>
                               <p className="text-[10px] font-bold text-primary uppercase">{e.label}</p>
                               <p className="text-sm font-bold font-mono">{e.value}</p>
                             </div>
                           </CardContent>
                         </Card>
                       ))}
                     </div>
                   </div>
                )}
              </div>
            )}

            {activeTab === 'report' && isCompleted && (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <Card className="border-green-500/50 shadow-2xl">
                  <CardHeader className="text-center border-b pb-8 bg-green-500/5">
                    <div className="h-20 w-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500/10">
                      <CheckCircle2 size={40} />
                    </div>
                    <CardTitle className="text-3xl font-black uppercase italic">RELATÓRIO TÉCNICO FINAL</CardTitle>
                    <CardDescription className="text-green-600 font-bold uppercase tracking-widest">Diagnóstico Concluído com Sucesso</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Nota Técnica</p>
                        <p className="text-4xl font-black text-primary">{state.score > 90 ? 'S' : state.score > 80 ? 'A' : 'B'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black">XP Ganho</p>
                        <p className="text-4xl font-black text-green-500">+{state.xp}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Precisão</p>
                        <p className="text-4xl font-black text-foreground">{state.score}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Status</p>
                        <p className="text-4xl font-black text-blue-500">OPK</p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t pt-8">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Cronologia do Diagnóstico</h4>
                      <div className="space-y-4">
                        {state.history.map((h, i) => (
                          <div key={i} className="flex gap-4 text-sm items-start">
                            <span className="text-[10px] font-mono text-muted-foreground mt-1 shrink-0">{new Date(h.timestamp).toLocaleTimeString()}</span>
                            <div className="space-y-1">
                              <p className="font-bold">{h.description}</p>
                              {h.points && h.points > 0 && <span className="text-[10px] font-bold text-green-500">+{h.points} XP</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button size="lg" className="w-full h-16 text-xl bg-green-600 hover:bg-green-700 mt-8" onClick={() => navigate({ to: "/library" })}>
                      Finalizar e Sair do Laboratório
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Diagram Modal */}
      {showDiagram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-8">
          <Card className="w-full h-full max-w-6xl overflow-hidden flex flex-col border-primary/20 shadow-2xl ring-1 ring-primary/20">
            <CardHeader className="flex flex-row items-center justify-between border-b py-4 bg-muted/30 px-6">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-3"><Layers className="text-primary" /> Documentação Técnica: {activeCase.title}</CardTitle>
                <CardDescription className="text-xs">Diagramas de Força e Comando (Referência NR-10)</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDiagram(false)} className="hover:bg-primary/10">×</Button>
            </CardHeader>
            <CardContent className="flex-1 bg-white p-0 overflow-auto flex items-center justify-center">
               <div className="p-12 text-center text-muted-foreground italic">
                 Diagrama técnico carregado para consulta. Em ambientes reais, consulte sempre o manual do fabricante.
               </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

