import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Zap, 
  Clock, 
  Target, 
  Play, 
  Info, 
  Layers, 
  Cpu, 
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLaboratory } from "@/hooks/useLaboratory";
import { useCasesByLab } from "@/hooks/useCase";
import { useSessions, useStartSession } from "@/hooks/useSession";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/library/$labId")({
  component: LabDetail,
});

function LabDetail() {
  const { labId } = Route.useParams();
  const navigate = useNavigate();

  const { data: labResult, isLoading: labLoading } = useLaboratory(labId);
  const { data: casesResult, isLoading: casesLoading } = useCasesByLab(labId);
  const { data: sessionsResult, isLoading: sessionsLoading } = useSessions();
  const startSessionMutation = useStartSession();

  const isLoading = labLoading || casesLoading || sessionsLoading;

  if (isLoading) {
    return <div className="p-8 space-y-8 max-w-7xl mx-auto"><Skeleton className="w-full h-[600px]" /></div>;
  }

  const lab = labResult?.success ? labResult.data : null;
  const cases = casesResult?.success ? casesResult.data : [];
  const sessions = sessionsResult?.success ? sessionsResult.data : [];

  if (!lab) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Laboratório não encontrado</h1>
        <Button onClick={() => navigate({ to: '/library' })}>Voltar para Biblioteca</Button>
      </div>
    );
  }

  const sessionsMap = sessions.reduce((acc, s) => {
    acc[s.case_id] = s;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto p-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: '/library' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Biblioteca
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono text-[10px] uppercase border-2">{lab.code}</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary">{lab.level}</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{lab.name}</h1>
              <p className="text-muted-foreground text-lg">{lab.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="text-muted-foreground leading-none">XP Disponível</p>
                    <p className="font-bold">{lab.totalXp} XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="text-muted-foreground leading-none">Estimativa</p>
                    <p className="font-bold">{lab.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="text-muted-foreground leading-none">Precisão Média</p>
                    <p className="font-bold">94%</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="w-full md:w-64 bg-background/50 border-2">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>Seu Progresso</span>
                  <span>{lab.progress}%</span>
                </div>
                <Progress value={lab.progress} className="h-2" />
                <p className="text-[10px] text-center text-muted-foreground">
                  Complete todos os defeitos para receber o certificado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <Tabs defaultValue="defects" className="space-y-8">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="defects" className="gap-2">
              <AlertCircle className="h-4 w-4" /> Defeitos e Diagnósticos
            </TabsTrigger>
            <TabsTrigger value="circuit" className="gap-2">
              <Layers className="h-4 w-4" /> Esquemas Elétricos
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-2">
              <Cpu className="h-4 w-4" /> Componentes Técnicos
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-2">
              <FileText className="h-4 w-4" /> Documentação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="defects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((defect) => {
                const session = sessionsMap[defect.id];
                const isCompleted = session?.status === 'completed';
                const isStarted = session && session.status !== 'completed';

                return (
                  <Card 
                    key={defect.id} 
                    className={cn(
                      "group relative overflow-hidden transition-all border-2",
                      isCompleted ? "bg-primary/5 border-primary/20" : "hover:border-primary/50"
                    )}
                  >
                    {isCompleted && (
                      <div className="absolute top-3 right-3 text-primary">
                        <CheckCircle2 className="h-5 w-5 fill-primary/20" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="font-mono text-[10px] border-2">{defect.code}</Badge>
                        {!isCompleted && <Badge variant="secondary" className="text-[10px]">{defect.difficulty}</Badge>}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{defect.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">{defect.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> +{defect.xpReward} XP</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {defect.estimatedTime}</span>
                      </div>
                      
                      <Button 
                        className={cn(
                          "w-full h-9 text-xs gap-2 transition-all",
                          isCompleted ? "bg-primary/20 text-primary hover:bg-primary/30" : ""
                        )}
                        variant={isCompleted ? "secondary" : "default"}
                        disabled={startSessionMutation.isPending}
                        onClick={async () => {
                          if (!isCompleted && !isStarted) {
                            await startSessionMutation.mutateAsync(defect.id);
                          }
                          navigate({ to: '/simulations', search: { id: defect.id } });
                        }}
                      >
                        {isCompleted ? "Revisar Diagnóstico" : isStarted ? "Continuar Simulação" : "Iniciar Simulação"}
                        <Play className={cn("h-3 w-3", !isCompleted && "fill-current")} />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {cases.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-bold">Nenhum diagnóstico disponível</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                  Ainda não foram cadastrados defeitos para este laboratório no banco de dados.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="circuit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                <div className="aspect-video bg-muted relative flex items-center justify-center border-b">
                  <Layers className="h-12 w-12 text-muted-foreground/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                    <Badge variant="outline" className="bg-background/50">Principal</Badge>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Diagrama de Força</CardTitle>
                  <CardDescription className="text-[10px]">Circuito de potência e conexões do motor</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Button variant="ghost" size="sm" className="w-full text-[10px] h-8 gap-2">
                    <Info className="h-3 w-3" /> Ver Detalhes
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                <div className="aspect-video bg-muted relative flex items-center justify-center border-b">
                  <Layers className="h-12 w-12 text-muted-foreground/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                    <Badge variant="outline" className="bg-background/50">Lógica</Badge>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Diagrama de Comando</CardTitle>
                  <CardDescription className="text-[10px]">Lógica de controle e sinalização</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Button variant="ghost" size="sm" className="w-full text-[10px] h-8 gap-2">
                    <Info className="h-3 w-3" /> Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="components">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Contator KM1", type: "Manobra", ref: "KM1" },
                { name: "Relé Térmico F1", type: "Proteção", ref: "F1" },
                { name: "Disjuntor Q1", type: "Proteção", ref: "Q1" },
                { name: "Motor Trifásico M1", type: "Carga", ref: "M1" },
                { name: "Botão Start S1", type: "Comando", ref: "S1" },
                { name: "Botão Stop S0", type: "Comando", ref: "S0" },
              ].map((comp, i) => (
                <Card key={i} className="group hover:border-primary transition-all cursor-pointer border-2">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="h-12 w-12 bg-muted rounded-lg mx-auto flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Cpu className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-primary leading-none">{comp.ref}</p>
                      <p className="text-xs font-bold leading-tight">{comp.name}</p>
                      <p className="text-[9px] text-muted-foreground">{comp.type}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10">
                      <Info className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="docs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Manual de Operação", size: "2.4 MB", type: "PDF" },
                { title: "Guia de Manutenção", size: "1.8 MB", type: "PDF" },
                { title: "Datasheet Contator", size: "0.9 MB", type: "PDF" },
                { title: "Norma NR-10", size: "4.2 MB", type: "PDF" },
              ].map((doc, i) => (
                <Card key={i} className="hover:border-primary/50 transition-all cursor-pointer border-2">
                  <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                    <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{doc.title}</CardTitle>
                      <CardDescription className="text-[10px]">{doc.type} • {doc.size}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button variant="outline" size="sm" className="w-full text-[10px] h-8">Baixar Documento</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
