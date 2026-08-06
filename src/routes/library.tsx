import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, BookOpen, Clock, Zap, Target, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  
  const navigate = useNavigate();
  const { laboratories, isLoading } = useAppStore();

  const filteredLabs = laboratories.filter(lab => {
    const matchesSearch = 
      lab.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lab.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === "all" || lab.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  }).sort((a, b) => {
    if (sortBy === "xp") return b.totalXp - a.totalXp;
    if (sortBy === "difficulty") {
      const levels: Record<string, number> = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3, 'Especialista': 4 };
      return (levels[b.level] || 0) - (levels[a.level] || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleLabClick = (labId: string) => {
    navigate({ to: `/library/${labId}` });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen">
      <header className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Biblioteca Técnica</h1>
          <p className="text-muted-foreground text-lg">Laboratórios Virtuais de Diagnóstico Industrial em Comandos Elétricos.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar por código, título, componente ou tecnologia..." 
              className="pl-10 h-11 bg-card border-2" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[160px] h-11 border-2 bg-card">
                <Filter className="w-4 h-4 mr-2 opacity-50" />
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="Iniciante">Iniciante</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
                <SelectItem value="Especialista">Especialista</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-11 border-2 bg-card">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="xp">Maior XP</SelectItem>
                <SelectItem value="difficulty">Dificuldade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => (
          <Card 
            key={lab.id} 
            className="group hover:border-primary/50 transition-all flex flex-col border-2 overflow-hidden bg-card"
          >
            <div className="h-40 bg-muted relative overflow-hidden">
               {/* Placeholder for future Supabase Storage images */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary/20" />
               </div>
               <div className="absolute top-3 left-3 flex gap-2">
                 <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-mono text-xs uppercase">
                   {lab.code}
                 </Badge>
               </div>
               <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background text-muted-foreground"
               >
                 <Star className="h-4 w-4" />
               </Button>
            </div>

            <CardHeader className="space-y-2">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {lab.level}
                </Badge>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors text-xl leading-tight">
                {lab.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-10">
                {lab.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 flex-grow">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span>{lab.defectCount} Defeitos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{lab.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>{lab.totalXp} XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <span>{lab.averageAccuracy}% Precisão</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Progresso</span>
                  <span>{lab.progress}%</span>
                </div>
                <Progress value={lab.progress} className="h-1.5" />
              </div>
            </CardContent>

            <CardFooter className="pt-0 border-t bg-muted/30 mt-auto">
              <Button 
                onClick={() => handleLabClick(lab.id)}
                className="w-full group mt-4 h-11"
                variant="default"
              >
                Entrar no Laboratório
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredLabs.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed rounded-xl bg-muted/10">
            <Search className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
            <div className="space-y-1">
              <p className="text-xl font-bold">Nenhum laboratório encontrado</p>
              <p className="text-muted-foreground">Tente ajustar seus filtros ou termos de pesquisa.</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setLevelFilter("all"); }}>
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
