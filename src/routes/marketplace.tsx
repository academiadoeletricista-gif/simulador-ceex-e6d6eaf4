import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { ShoppingCart, Package, Filter, Zap, Trash2, Check, CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useMarketplace, Product } from "@/hooks/useMarketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  component: Marketplace,
});

function Marketplace() {
  const { cart, addToCart, removeFromCart, clearCart } = useAppStore();
  const { data: profileResult, isLoading: profileLoading } = useProfile();
  const { data: marketplaceResult, isLoading: marketplaceLoading } = useMarketplace();
  
  const [filter, setFilter] = useState<string>("all");

  const isLoading = profileLoading || marketplaceLoading;

  if (isLoading) {
    return <div className="p-8 space-y-8 max-w-7xl mx-auto"><Skeleton className="w-full h-[600px]" /></div>;
  }

  const profile = profileResult?.success ? profileResult.data : null;
  const marketplace = marketplaceResult?.success ? marketplaceResult.data : [];

  const cartItems = marketplace.filter(p => cart.includes(p.id));
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const filteredItems = filter === "all" 
    ? marketplace 
    : marketplace.filter(p => p.category === filter);

  const categories = ["all", ...new Set(marketplace.map(p => p.category))];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace CEEX</h1>
          <p className="text-muted-foreground">Invista seu conhecimento. Adquira ferramentas e recursos exclusivos.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <Zap className="h-5 w-5 text-primary" />
          <div className="text-sm font-bold">
            <span className="text-muted-foreground mr-2">Seu Saldo:</span>
            <span>{profile?.xp?.toLocaleString() || 0} XP</span>
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Badge 
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5 whitespace-nowrap capitalize"
            onClick={() => setFilter(cat)}
          >
            {cat === "all" ? "Todos os Itens" : cat}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isInCart = cart.includes(item.id);
            const canAfford = (profile?.xp || 0) >= item.price;

            return (
              <Card key={item.id} className="group overflow-hidden border-2 hover:border-primary/50 transition-all flex flex-col">
                <div className="h-40 bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                  <Badge className="absolute top-3 right-3 bg-primary text-white border-none shadow-lg">
                    {item.price.toLocaleString()} XP
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{item.category}</p>
                    <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4 flex-grow">
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{item.description}</p>
                  {item.requirements && (
                    <div className="text-[10px] font-medium bg-muted p-2 rounded flex items-center gap-2">
                      <ShoppingBag size={12} />
                      <span className="truncate">Requisito: {item.requirements}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full gap-2" 
                    variant={isInCart ? "secondary" : "default"}
                    disabled={!canAfford && !isInCart}
                    onClick={() => isInCart ? removeFromCart(item.id) : addToCart(item.id)}
                  >
                    {isInCart ? (
                      <><Check size={16} /> No Carrinho</>
                    ) : !canAfford ? (
                      "XP Insuficiente"
                    ) : (
                      <><ShoppingCart size={16} /> Adicionar</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-primary/20 sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Seu Carrinho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto opacity-20" />
                  <p className="text-xs text-muted-foreground">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 group">
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{item.name}</p>
                        <p className="text-[10px] text-primary">{item.price.toLocaleString()} XP</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  <div className="pt-4 border-t space-y-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">{cartTotal.toLocaleString()} XP</span>
                    </div>
                    <Button className="w-full gap-2" disabled={cartTotal > (profile?.xp || 0)}>
                      <CreditCard size={16} /> Confirmar Troca
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-[10px] h-6 text-muted-foreground" onClick={clearCart}>
                      Limpar Carrinho
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
