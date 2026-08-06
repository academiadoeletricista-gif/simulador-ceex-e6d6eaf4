import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Zap } from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  component: MarketplacePage,
});

const products = [
  { id: 1, title: "Curso Avançado CLP", price: "2.500 XP", type: "Curso", rating: 4.8 },
  { id: 2, title: "Biblioteca de Simbologia", price: "500 XP", type: "Biblioteca", rating: 4.5 },
  { id: 3, title: "Simulador de Falhas 3D", price: "5.000 XP", type: "Simulador", rating: 4.9 },
  { id: 4, title: "Mentoria Técnica Individual", price: "10.000 XP", type: "Mentoria", rating: 5.0 },
];

function MarketplacePage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Troque seu XP por recursos exclusivos</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold border border-primary/20">
          <Zap size={20} /> 2.450 XP
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <div className="h-40 bg-muted/30 flex items-center justify-center text-4xl">📦</div>
            <CardHeader>
              <div className="flex justify-between text-xs mb-2">
                <Badge variant="outline">{p.type}</Badge>
                <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {p.rating}</span>
              </div>
              <CardTitle className="text-lg">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="font-bold text-primary">{p.price}</div>
              <Button className="w-full gap-2"><ShoppingCart size={16} /> Comprar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
