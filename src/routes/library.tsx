import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen } from "lucide-react";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

const categories = [
  "Motores", "Contatores", "Reversão", "Estrela-Triângulo", "Temporizadores", 
  "CLP", "Soft Starter", "Inversores", "Bombas", "Compressores", "Painéis", 
  "Sensores", "Normas", "Segurança"
];

const cases = [
  { id: '1', title: 'Falha na Reversão de Motor', category: 'Reversão', level: 'Intermediário', xp: 450, time: '8 min' },
  { id: '2', title: 'Curto-circuito em Contator', category: 'Contatores', level: 'Iniciante', xp: 200, time: '5 min' },
  { id: '3', title: 'Parametrização de Soft Starter', category: 'Soft Starter', level: 'Avançado', xp: 800, time: '15 min' },
  { id: '4', title: 'Erro de Lógica em CLP S7-1200', category: 'CLP', level: 'Especialista', xp: 1200, time: '25 min' },
  { id: '5', title: 'Aquecimento Excessivo em Bomba', category: 'Bombas', level: 'Intermediário', xp: 500, time: '10 min' },
  { id: '6', title: 'Falha de Sincronismo em Inversor', category: 'Inversores', level: 'Avançado', xp: 750, time: '12 min' },
];

function LibraryPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Biblioteca</h1>
          <p className="text-muted-foreground">Explore nossa base de conhecimentos e casos de estudo</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar casos..." className="pl-10" />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Badge key={cat} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap">
            {cat}
          </Badge>
        ))}
        <Button variant="ghost" size="sm" className="gap-2 shrink-0">
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c) => (
          <Card key={c.id} className="cursor-pointer hover:border-primary/50 transition-all group">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{c.category}</Badge>
                <span className="text-xs font-medium text-primary">{c.xp} XP</span>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">{c.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {c.level}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.time}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
