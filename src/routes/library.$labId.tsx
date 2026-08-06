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
import { useSessions } from "@/hooks/useSession";
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
                        {!isCompleted && <Badge variant="secondary" className="text-[10px]">{defect.level}</Badge>}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{defect.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">{defect.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> +{defect.xpReward} XP</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {defect.timeEstimate}</span>
                      </div>
                      
                      <Button 
                        className={cn(
                          "w-full h-9 text-xs gap-2 transition-all",
                          isCompleted ? "bg-primary/20 text-primary hover:bg-primary/30" : ""
                        )}
                        variant={isCompleted ? "secondary" : "default"}
                        onClick={() => navigate({ to: '/simulations', search: { id: defect.id } })}
                      >
                        {isCompleted ? "Revisar Diagnóstico" : isStarted ? "Continuar Simulação" : "Iniciar Simulação"}
                        <Play className={cn("h-3 w-3", !isCompleted && "fill-current")} />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="circuit">
            <Card className="border-2 dashed bg-muted/20 min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Layers className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle>Esquemas Interativos</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                  Visualize diagramas unifilares e multifilares. Identifique pontos de medição e hotspots térmicos.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Lock className="h-3 w-3" /> Liberado após Nível 5
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="components">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="group hover:border-primary transition-all cursor-pointer">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="h-12 w-12 bg-muted rounded-lg mx-auto flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Cpu className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <p className="text-xs font-bold leading-tight">Componente T{i+1}</p>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Info className="h-3 w-3" />
                    </Button>
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
