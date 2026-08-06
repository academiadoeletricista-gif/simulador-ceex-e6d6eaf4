import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAppStore, Product } from "@/store/useAppStore";
import { 
  ShoppingCart, 
  Star, 
  Zap, 
  Search, 
  Filter, 
  X, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Monitor,
  Video,
  Users as UsersIcon
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  component: MarketplacePage,
});

function MarketplacePage() {
  const { xp, marketplace, cart, addToCart, removeFromCart } = useAppStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("Todos");

  const categories = ["Todos", "Curso", "Biblioteca", "Simulador", "Mentoria"];

  const filteredProducts = marketplace.filter(p => 
    (filter === "Todos" || p.type === filter) &&
    (p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const cartItems = marketplace.filter(p => cart.includes(p.id));
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const getIcon = (type: string) => {
    switch(type) {
      case 'Curso': return <Video className="h-4 w-4" />;
      case 'Biblioteca': return <BookOpen className="h-4 w-4" />;
      case 'Simulador': return <Monitor className="h-4 w-4" />;
      case 'Mentoria': return <UsersIcon className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Expanda seus recursos com conteúdo premium e mentorias.</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold border border-primary/20 shrink-0">
            <Zap size={20} className="fill-primary" /> {xp.toLocaleString()} XP
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar produtos..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <Button 
                key={cat} 
                variant={filter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <Card key={p.id} className="group flex flex-col relative overflow-hidden bg-card/40 border-primary/10 hover:border-primary/30 transition-all duration-300">
              <div className="h-48 bg-muted/20 flex items-center justify-center text-5xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:scale-110 transition-transform duration-500">
                  {p.type === 'Curso' ? '🎓' : p.type === 'Biblioteca' ? '📚' : p.type === 'Simulador' ? '🎮' : '🤝'}
                </span>
                <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground border-none shadow-sm">
                  {p.type}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> {p.rating}
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Conteúdo exclusivo desenvolvido por especialistas do Laboratório de Diagnóstico.
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Investimento</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Zap size={14} className="fill-primary" /> {p.price.toLocaleString()}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  className={cn("gap-2", cart.includes(p.id) ? "bg-green-500 hover:bg-green-600" : "")}
                  onClick={() => addToCart(p.id)}
                  disabled={cart.includes(p.id)}
                >
                  {cart.includes(p.id) ? (
                    <><CheckCircle2 size={16} /> No Carrinho</>
                  ) : (
                    <><ShoppingCart size={16} /> Adicionar</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <aside className="w-full lg:w-80 border-l bg-card/30 backdrop-blur-md flex flex-col h-full shrink-0">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> Seu Carrinho
          </h2>
          <Badge variant="secondary">{cart.length}</Badge>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-40">
              <ShoppingCart size={48} className="text-muted-foreground" />
              <p className="text-sm">Seu carrinho está vazio.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-background/50 border group">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                  {item.type === 'Curso' ? '🎓' : '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{item.title}</p>
                  <p className="text-[10px] text-primary font-bold flex items-center gap-1">
                    <Zap size={10} className="fill-primary" /> {item.price.toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="h-6 w-6 rounded-md hover:bg-destructive/10 hover:text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t bg-card/50 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold flex items-center gap-1 text-primary">
                <Zap size={14} className="fill-primary" /> {cartTotal.toLocaleString()} XP
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Saldo após compra</span>
              <span className={cn(
                "font-medium",
                xp - cartTotal < 0 ? "text-destructive" : "text-green-500"
              )}>
                {(xp - cartTotal).toLocaleString()} XP
              </span>
            </div>
          </div>
          <Button className="w-full gap-2" disabled={cartItems.length === 0 || xp < cartTotal}>
            Finalizar Compra <ArrowRight size={16} />
          </Button>
          {xp < cartTotal && (
            <p className="text-[10px] text-destructive text-center font-medium">
              XP insuficiente para finalizar a compra.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
