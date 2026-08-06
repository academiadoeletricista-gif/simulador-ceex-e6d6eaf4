import { createFileRoute, useNavigate, Outlet } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Clock, 
  Zap, 
  ChevronRight,
  FlaskConical,
  Cpu,
  Layers
} from "lucide-react";
import { useState } from "react";
import { useLaboratories } from "@/hooks/useLaboratory";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/library")({
  component: Library,
});

function Library() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const { data: laboratoriesResult, isLoading } = useLaboratories();

  if (isLoading) {
    return <div className="p-8 space-y-8 max-w-7xl mx-auto"><Skeleton className="w-full h-[600px]" /></div>;
  }

  const laboratories = laboratoriesResult?.success ? laboratoriesResult.data : [];

  const filteredLabs = laboratories
    .filter(lab => 
      (lab.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       lab.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "all" || lab.level === filter)
    )
    .sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0));

  return (
    <>
      <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Laboratórios</h1>
              <p className="text-muted-foreground">Escolha um ambiente industrial para iniciar seus estudos e diagnósticos.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar laboratório..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["all", "Iniciante", "Intermediário", "Avançado", "Especialista"].map((level) => (
              <Badge 
                key={level}
                variant={filter === level ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 whitespace-nowrap"
                onClick={() => setFilter(level)}
              >
                {level === "all" ? "Todos os Níveis" : level}
              </Badge>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <Card 
              key={lab.id} 
              className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden border-2"
              onClick={() => navigate({ to: '/library/$labId', params: { labId: lab.id } })}
            >
              <div className="h-32 bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FlaskConical className="h-12 w-12 text-primary/40" />
                </div>
                <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur text-foreground border-none">
                  {lab.level}
                </Badge>
                <Badge variant="outline" className="absolute top-3 left-3 font-mono text-[10px] uppercase bg-background/80 backdrop-blur">
                  {lab.code}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{lab.name}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">{lab.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Zap size={14} className="text-primary" />
                    <span>{lab.totalXp} XP Total</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Clock size={14} />
                    <span>{lab.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Layers size={14} />
                    <span>{lab.componentCount} Componentes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Cpu size={14} />
                    <span>{lab.defectCount} Defeitos</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">Progresso do Aluno</span>
                    <span>{lab.progress}%</span>
                  </div>
                  <Progress value={lab.progress} className="h-1.5" />
                </div>
              </CardContent>
              <CardContent className="pt-0 border-t bg-muted/30 flex items-center justify-between p-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="h-6 w-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    +12
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-2 group-hover:gap-3 transition-all">
                  Explorar <ChevronRight size={14} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLabs.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
            <p className="text-muted-foreground">Nenhum laboratório encontrado com os filtros selecionados.</p>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setFilter("all"); }}>Limpar Filtros</Button>
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
}
