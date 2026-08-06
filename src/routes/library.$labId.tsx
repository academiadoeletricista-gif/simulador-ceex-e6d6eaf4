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
  Info,
  Layers,
  Component,
  Microscope,
  FileBarChart,
  BookOpen,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
      <header className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: "/library" })}
          className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Biblioteca
        </Button>
        
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-xs uppercase px-2 py-0.5 border-2">
                {lab.code}
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {lab.level}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">v{lab.version}</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">{lab.name}</h1>
            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
              {lab.description}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {lab.competencies?.map((comp, i) => (
                <Badge key={i} variant="outline" className="bg-muted/50 text-xs py-1">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0 lg:w-80">
            {[
              { label: 'Defeitos', value: lab.defectCount, icon: Target, color: 'text-orange-500' },
              { label: 'Tempo Médio', value: lab.estimatedDuration, icon: Clock, color: 'text-blue-500' },
              { label: 'XP Total', value: lab.totalXp, icon: Zap, color: 'text-yellow-500' },
              { label: 'Precisão', value: `${lab.averageAccuracy}%`, icon: FileBarChart, color: 'text-purple-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-card border-2 p-3 rounded-xl flex flex-col justify-between">
                <stat.icon className={cn("h-4 w-4 mb-2", stat.color)} />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                  <p className="text-lg font-bold leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <Tabs defaultValue="defects" className="space-y-8">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-6 overflow-x-auto no-scrollbar">
          {[
            { value: 'defects', label: 'Defeitos', icon: AlertTriangle },
            { value: 'circuit', label: 'Circuito Base', icon: Layout },
            { value: 'panel', label: 'Painel Industrial', icon: Box },
            { value: 'components', label: 'Componentes', icon: Component },
            { value: 'resources', label: 'Recursos', icon: BookOpen }
          ].map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-0 h-full font-bold text-muted-foreground data-[state=active]:text-foreground transition-all flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="defects" className="space-y-6 outline-none">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h3 className="text-xl font-bold">Cenários de Diagnóstico</h3>
                <p className="text-sm text-muted-foreground">Selecione um defeito para iniciar a investigação no laboratório.</p>
             </div>
             <div className="flex gap-2">
                <Badge variant="outline" className="h-8">{labCases.length} Casos</Badge>
             </div>
          </div>
          
          <div className="grid gap-4">
            {labCases.map((defect) => {
              const session = sessions[defect.id];
              const isCompleted = session?.status === 'completed';
              
              return (
                <Card key={defect.id} className={cn(
                  "group hover:border-primary/50 transition-all border-2 bg-card overflow-hidden",
                  isCompleted && "border-green-500/20"
                )}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                       <div className={cn(
                         "w-2 md:w-3 shrink-0",
                         isCompleted ? "bg-green-500" : "bg-muted group-hover:bg-primary/40 transition-colors"
                       )} />
                       
                       <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 flex-grow">
                          <div className="flex items-center gap-6 flex-1">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center border-2 shrink-0 transition-transform group-hover:scale-110",
                              isCompleted ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-muted border-muted text-muted-foreground"
                            )}>
                              {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-muted-foreground font-bold">{defect.code}</span>
                                <h3 className="font-bold text-lg leading-tight">{defect.title}</h3>
                                <Badge variant="outline" className="text-[10px] h-4 py-0">{defect.level}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">{defect.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                            <div className="flex items-center gap-6 text-xs whitespace-nowrap font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {defect.time_estimate}</span>
                              <span className="flex items-center gap-1.5 font-bold text-primary"><Zap className="h-3.5 w-3.5" /> +{defect.xp_reward} XP</span>
                            </div>
                            <Button asChild className="shrink-0 h-10 px-6 font-bold" variant={isCompleted ? "secondary" : "default"}>
                              <Link to="/simulations" search={{ id: defect.id }}>
                                {isCompleted ? "Refazer" : "Diagnosticar"}
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="circuit" className="outline-none space-y-8">
           <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h3 className="text-xl font-bold">Engenharia do Circuito</h3>
                <p className="text-sm text-muted-foreground">Documentação técnica e diagramas oficiais do {lab.name}.</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Diagrama de Potência', icon: Zap, desc: 'Esquema dos componentes de força e carga.' },
              { title: 'Diagrama de Comando', icon: Settings, desc: 'Lógica de acionamento e sinalização.' },
              { title: 'Lista de Bornes', icon: Layers, desc: 'Mapeamento físico de conexões.' }
            ].map((card, i) => (
              <Card key={i} className="border-2 border-dashed bg-muted/5 group hover:bg-muted/10 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-md">
                    <card.icon className="h-5 w-5 text-primary" /> {card.title}
                  </CardTitle>
                  <CardDescription className="text-xs">{card.desc}</CardDescription>
                </CardHeader>
                <CardContent className="h-48 flex flex-col items-center justify-center text-muted-foreground p-8">
                  <FileText className="h-10 w-10 opacity-10 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] text-center uppercase tracking-widest font-bold">Supabase Storage Asset</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="panel" className="outline-none space-y-8">
           <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h3 className="text-xl font-bold">Painel Industrial</h3>
                <p className="text-sm text-muted-foreground">Interface visual do painel físico e disposição dos componentes.</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-dashed bg-muted/5 relative overflow-hidden group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" /> Vista Frontal
                </CardTitle>
                <CardDescription>Porta do painel, botões e sinaleiros.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                <Box className="h-20 w-20 opacity-5 mb-4 group-hover:scale-110 transition-transform duration-500" />
                <p className="text-sm font-mono opacity-40">[PANEL_FRONT_VIEW_MAPPED]</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-dashed bg-muted/5 relative overflow-hidden group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" /> Vista Interna
                </CardTitle>
                <CardDescription>Placa de montagem e trilhos DIN.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                <Settings className="h-20 w-20 opacity-5 mb-4 group-hover:rotate-45 transition-transform duration-500" />
                <p className="text-sm font-mono opacity-40">[PANEL_INTERNAL_VIEW_MAPPED]</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="outline-none space-y-8">
           <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h3 className="text-xl font-bold">Ficha Técnica</h3>
                <p className="text-sm text-muted-foreground">Catálogo de componentes utilizados neste laboratório.</p>
             </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {Array.from({length: 4}).map((_, i) => (
                <Card key={i} className="border-2 bg-card hover:border-primary/30 transition-colors">
                  <div className="h-32 bg-muted/30 flex items-center justify-center">
                    <Component className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                  <CardHeader className="p-4 space-y-1">
                    <Badge variant="outline" className="w-fit text-[10px]">KM{i+1}</Badge>
                    <CardTitle className="text-sm font-bold">Componente Técnico</CardTitle>
                    <CardDescription className="text-[10px]">Fabricante / Modelo</CardDescription>
                  </CardHeader>
                </Card>
             ))}
             <Card className="border-2 border-dashed bg-muted/5 flex flex-col items-center justify-center p-6 text-center">
                <Info className="h-6 w-6 text-muted-foreground opacity-30 mb-2" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Ver Catálogo Completo</p>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="outline-none space-y-8">
           <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h3 className="text-xl font-bold">Recursos Didáticos</h3>
                <p className="text-sm text-muted-foreground">Materiais de apoio, manuais e vídeos técnicos.</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {['Manual de Instalação', 'Vídeo de Funcionamento', 'Normas Técnicas'].map((res, i) => (
                <Card key={i} className="border-2 hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm">{res}</p>
                      <p className="text-[10px] text-muted-foreground">Clique para acessar</p>
                    </div>
                  </CardContent>
                </Card>
             ))}
          </div>
        </TabsContent>
      </Tabs>

      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-4 z-10 flex justify-center">
         <div className="max-w-7xl w-full flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 flex-1">
               <div className="flex-1 space-y-1 max-w-xs hidden sm:block">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span className="text-muted-foreground">Seu Progresso</span>
                     <span>{lab.progress}%</span>
                  </div>
                  <Progress value={lab.progress} className="h-1.5" />
               </div>
               <div className="h-8 w-px bg-border hidden sm:block" />
               <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                     <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <div className="leading-none">
                     <p className="text-[10px] text-muted-foreground font-bold uppercase">XP Obtido</p>
                     <p className="text-sm font-bold">0 / {lab.totalXp}</p>
                  </div>
               </div>
            </div>
            
            <Button className="h-12 px-8 font-extrabold text-md shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => {
              const firstCase = labCases[0];
              if (firstCase) navigate({ to: '/simulations', search: { id: firstCase.id } });
            }}>
              Iniciar Jornada no Laboratório
              <Zap className="ml-2 h-5 w-5 fill-current" />
            </Button>
         </div>
      </footer>
    </div>
  );
}
