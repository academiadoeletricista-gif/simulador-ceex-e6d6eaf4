import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Zap, 
  Clock, 
  Target, 
  Settings, 
  Layout, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library/$labId")({
  component: LaboratoryDetailPage,
});

function LaboratoryDetailPage() {
  const { labId } = Route.useParams();
  const navigate = useNavigate();
  const { laboratories, cases, sessions, isLoading } = useAppStore();

  const lab = laboratories.find(l => l.id === labId);
  const labCases = cases.filter(c => c.laboratory_id === labId);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Laboratório não encontrado</h2>
        <Button onClick={() => navigate({ to: "/library" })}>Voltar para Biblioteca</Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      <header className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: "/library" })}
          className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Biblioteca
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-xs uppercase px-2 py-0.5">
                {lab.code}
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {lab.level}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{lab.name}</h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              {lab.description}
            </p>
          </div>
          
          <div className="flex gap-4 p-4 rounded-xl bg-card border">
            <div className="text-center px-4 border-r">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Defeitos</p>
              <p className="text-2xl font-bold">{lab.defectCount}</p>
            </div>
            <div className="text-center px-4 border-r">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Tempo</p>
              <p className="text-2xl font-bold">{lab.estimatedTime}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">XP Total</p>
              <p className="text-2xl font-bold text-primary">{lab.totalXp}</p>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="defects" className="space-y-8">
        <TabsList className="bg-background border-b rounded-none w-full justify-start h-12 p-0 gap-8">
          <TabsTrigger value="defects" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 h-full font-semibold">
            Defeitos Disponíveis
          </TabsTrigger>
          <TabsTrigger value="circuit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 h-full font-semibold">
            Circuito Base
          </TabsTrigger>
          <TabsTrigger value="panel" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 h-full font-semibold">
            Painel Industrial
          </TabsTrigger>
          <TabsTrigger value="components" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 h-full font-semibold">
            Componentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="defects" className="space-y-6 outline-none">
          <div className="grid gap-4">
            {labCases.map((defect) => {
              const session = sessions[defect.id];
              const isCompleted = session?.status === 'completed';
              
              return (
                <Card key={defect.id} className={cn(
                  "group hover:border-primary/50 transition-all border-2",
                  isCompleted && "border-green-500/20 bg-green-500/[0.02]"
                )}>
                  <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center border-2 shrink-0",
                        isCompleted ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-muted border-muted text-muted-foreground"
                      )}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{defect.code}</span>
                          <h3 className="font-bold text-lg">{defect.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{defect.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="flex items-center gap-4 text-sm whitespace-nowrap">
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {defect.time_estimate}</span>
                        <span className="flex items-center gap-1.5 font-bold text-primary"><Zap className="h-4 w-4" /> +{defect.xp_reward} XP</span>
                      </div>
                      <Button asChild className="shrink-0 group-hover:gap-3 transition-all" variant={isCompleted ? "secondary" : "default"}>
                        <Link to="/simulations" search={{ id: defect.id }}>
                          {isCompleted ? "Refazer Simulação" : "Iniciar Diagnóstico"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="circuit" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-dashed bg-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" /> Diagrama Unifilar
                </CardTitle>
                <CardDescription>Estrutura preparada para receber o diagrama industrial oficial.</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex flex-col items-center justify-center text-muted-foreground">
                <FileText className="h-12 w-12 opacity-20 mb-4" />
                <p className="text-sm">Aguardando upload do diagrama técnico.</p>
              </CardContent>
            </Card>
            <Card className="border-dashed bg-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" /> Pontos de Medição
                </CardTitle>
                <CardDescription>Mapa completo de bornes e conexões para o multímetro.</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex flex-col items-center justify-center text-muted-foreground">
                <Target className="h-12 w-12 opacity-20 mb-4" />
                <p className="text-sm">Estrutura de medição mapeada via Universal Case Schema.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="panel" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-dashed bg-muted/20">
              <CardHeader>
                <CardTitle>Vista Frontal do Painel</CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex flex-col items-center justify-center text-muted-foreground">
                <Layout className="h-16 w-16 opacity-10 mb-4" />
                <p>Estrutura pronta para visualização em alta resolução.</p>
              </CardContent>
            </Card>
            <Card className="border-dashed bg-muted/20">
              <CardHeader>
                <CardTitle>Vista Interna (Layout)</CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex flex-col items-center justify-center text-muted-foreground">
                <Settings className="h-16 w-16 opacity-10 mb-4" />
                <p>Mapeamento de trilhos, canaletas e componentes.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-dashed bg-muted/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Ficha Técnica dos Componentes</CardTitle>
                <CardDescription>Mapeamento industrial para integração com catálogo.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center justify-center h-48 text-muted-foreground text-center p-8">
                <Info className="h-8 w-8 opacity-20 mb-4" />
                <p className="text-xs italic">Lista de contatores, relés, disjuntores e sensores preparada para futura integração.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
