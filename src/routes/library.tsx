import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

const categories = [
  "Motores", "Contatores", "Reversão", "Estrela-Triângulo", "Temporizadores", 
  "CLP", "Soft Starter", "Inversores", "Bombas", "Compressores", "Painéis", 
  "Sensores", "Normas", "Segurança"
];

export const cases = [
  { 
    id: '1', 
    title: 'Falha na Reversão de Motor', 
    category: 'Reversão', 
    level: 'Intermediário', 
    xp: 450, 
    time: '8 min',
    description: 'O motor não está completando o ciclo de reversão. Suspeita-se de falha nos intertravamentos dos contatores K1 e K2.',
    symptoms: ['Motor gira apenas em um sentido', 'Contator de reversão não atraca'],
    checklist: ['Verificar tensão na bobina de K2', 'Inspecionar contatos auxiliares de K1'],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '2', 
    title: 'Curto-circuito em Contator', 
    category: 'Contatores', 
    level: 'Iniciante', 
    xp: 200, 
    time: '5 min',
    description: 'Um curto-circuito foi detectado no painel. O disjuntor de comando está desarmando ao tentar ligar o contator.',
    symptoms: ['Disjuntor desarma imediatamente', 'Odor de queimado no painel'],
    checklist: ['Medir resistência da bobina', 'Verificar fiação de comando'],
    image: 'https://images.unsplash.com/photo-1581092162384-8987c17b4926?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '3', 
    title: 'Parametrização de Soft Starter', 
    category: 'Soft Starter', 
    level: 'Avançado', 
    xp: 800, 
    time: '15 min',
    description: 'A Soft Starter está apresentando erro de subcorrente durante a partida de uma bomba centrífuga.',
    symptoms: ['Trip por subcorrente', 'Partida incompleta'],
    checklist: ['Revisar parâmetros P002 e P003', 'Verificar carga no eixo da bomba'],
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '4', 
    title: 'Erro de Lógica em CLP S7-1200', 
    category: 'CLP', 
    level: 'Especialista', 
    xp: 1200, 
    time: '25 min',
    description: 'A sequência de automação está travando no passo 4. O sensor de fim de curso não está sendo reconhecido na lógica Ladder.',
    symptoms: ['Processo parado no meio do ciclo', 'LED de entrada do CLP não acende'],
    checklist: ['Monitorar bloco DB10 no TIA Portal', 'Testar sensor de posição I0.4'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'
  },
];

function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { sessions } = useAppStore();
  const navigate = useNavigate();

  const filteredCases = cases.filter(c => {
    const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCaseClick = (caseId: string) => {
    navigate({ to: `/simulations`, search: { id: caseId } });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Biblioteca</h1>
          <p className="text-muted-foreground">Explore nossa base de conhecimentos e casos de estudo</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar casos..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Badge 
          variant={selectedCategory === null ? "default" : "secondary"}
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
          onClick={() => setSelectedCategory(null)}
        >
          Todos
        </Badge>
        {categories.map((cat) => (
          <Badge 
            key={cat} 
            variant={selectedCategory === cat ? "default" : "secondary"}
            className={cn(
              "cursor-pointer transition-colors whitespace-nowrap",
              selectedCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-primary/20"
            )}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((c) => {
          const session = sessions[c.id];
          const status = session?.status || 'available';

          return (
            <Card 
              key={c.id} 
              className={cn(
                "cursor-pointer hover:border-primary/50 transition-all group overflow-hidden border-2",
                status === 'completed' ? "border-green-500/30" : "border-border"
              )}
              onClick={() => handleCaseClick(c.id)}
            >
              <div className="relative h-32 w-full overflow-hidden bg-muted">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {status === 'completed' && (
                  <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                      <Search className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{c.category}</Badge>
                  <div className="flex gap-2">
                    {status === 'completed' && <Badge variant="default" className="bg-green-500 hover:bg-green-600">Concluído</Badge>}
                    {status === 'in_progress' && <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">Em andamento</Badge>}
                    <span className="text-xs font-medium text-primary">+{c.xp} XP</span>
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors text-lg">{c.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs"><BookOpen className="h-3 w-3" /> {c.level}</span>
                  <span className="flex items-center gap-1 text-xs"><Clock className="h-3 w-3" /> {c.time}</span>
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
        {filteredCases.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhum caso encontrado para os critérios selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
