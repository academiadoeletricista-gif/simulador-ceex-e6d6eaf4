import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, BookOpen, Clock, Zap, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { laboratories, isLoading } = useAppStore();

  console.log('LibraryPage render:', { labsCount: laboratories.length, isLoading });


  const filteredLabs = laboratories.filter(lab => 
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lab.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Laboratórios Virtuais</h1>
          <p className="text-muted-foreground">Circuitos industriais reais para treinamento de diagnóstico avançado</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar laboratórios..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => (
          <Card 
            key={lab.id} 
            className="group hover:border-primary/50 transition-all flex flex-col border-2 overflow-hidden"
          >
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="font-mono text-xs uppercase">
                  {lab.code}
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {lab.level}
                </Badge>
              </div>
              <div>
                <CardTitle className="group-hover:text-primary transition-colors text-xl">
                  {lab.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2 h-10">
                  {lab.description}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 flex-grow">
              <div className="grid grid-cols-2 gap-4">
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

            <CardFooter className="pt-0">
              <Button 
                onClick={() => handleLabClick(lab.id)}
                className="w-full group"
                variant="default"
              >
                Entrar no Laboratório
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredLabs.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            Nenhum laboratório encontrado para os critérios selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
