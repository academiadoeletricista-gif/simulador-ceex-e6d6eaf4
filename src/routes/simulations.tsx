import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Target, BookOpen, AlertTriangle, ArrowRight, History, Info } from "lucide-react";

export const Route = createFileRoute("/simulations")({
  component: SimulationsPage,
});

function SimulationsPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Área Esquerda: Histórico */}
      <aside className="w-64 border-r bg-card/50 overflow-y-auto hidden lg:block">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2"><History size={16} /> Histórico</h3>
        </div>
        <div className="divide-y divide-muted">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 hover:bg-muted/30 cursor-pointer transition-colors">
              <p className="text-sm font-medium">Passo {i}: Medição Tensão</p>
              <p className="text-xs text-muted-foreground italic">220V detectado na entrada K1</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Centro: Pergunta Atual */}
      <main className="flex-1 flex flex-col p-8 bg-background/50 relative">
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center space-y-8">
          <Badge className="bg-primary/20 text-primary border-primary/20 py-1 px-4 text-sm font-bold uppercase tracking-wider">
            Passo 6: Diagnóstico de Campo
          </Badge>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">O motor não parte após o acionamento do botão S1. Qual o próximo passo?</h2>
            <p className="text-xl text-muted-foreground italic">O som do contator K1 sendo atraído foi ouvido.</p>
          </div>

          <div className="grid grid-cols-1 w-full gap-4 pt-8">
            <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-primary/50 group">
              <span>Verificar continuidade nos contatos de força de K1</span>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-primary/50 group">
              <span>Medir tensão na saída do relé térmico F1</span>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button variant="outline" className="h-16 justify-between px-6 text-lg hover:border-primary/50 group">
              <span>Testar a bobina do contator K1</span>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>

        {/* Inferior: Ações Disponíveis */}
        <footer className="mt-auto pt-8 border-t flex justify-between items-center bg-background/80 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex gap-4">
            <Button variant="ghost" className="gap-2"><BookOpen size={18} /> Ver Esquema</Button>
            <Button variant="ghost" className="gap-2"><Info size={18} /> Dica (-50 XP)</Button>
          </div>
          <Button variant="destructive" className="gap-2"><AlertTriangle size={18} /> Chamar Supervisor</Button>
        </footer>
      </main>

      {/* Direita: Painel de Informações */}
      <aside className="w-80 border-l bg-card/50 overflow-y-auto hidden xl:block p-6 space-y-6">
        <h3 className="font-semibold flex items-center gap-2"><Info size={16} /> Painel de Informações</h3>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Caso Atual</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">#CMD-2024-001</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Tempo:</span>
              <span className="font-medium text-primary">04:12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Bônus:</span>
              <span className="font-medium text-secondary">MAX</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ferramentas</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" className="text-[10px] uppercase font-bold tracking-tighter">Multímetro</Button>
            <Button variant="secondary" size="sm" className="text-[10px] uppercase font-bold tracking-tighter">Alicate Amp.</Button>
            <Button variant="secondary" size="sm" className="text-[10px] uppercase font-bold tracking-tighter">Diagrama</Button>
            <Button variant="secondary" size="sm" className="text-[10px] uppercase font-bold tracking-tighter">Manual</Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sintomas</h4>
          <ul className="text-xs space-y-2">
            <li className="flex gap-2 text-red-500"><AlertTriangle size={12} /> Motor não gira</li>
            <li className="flex gap-2 text-yellow-500"><AlertTriangle size={12} /> Ruído metálico em K1</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
