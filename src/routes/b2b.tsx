import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  Download, 
  BarChart3, 
  ShieldCheck, 
  LayoutDashboard,
  Search,
  Filter
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useB2BData } from "@/hooks/useB2B";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export const Route = createFileRoute("/b2b")({
  component: B2BPage,
});

function B2BPage() {
  const { data: b2bResult, isLoading } = useB2BData();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  const { members, stats } = b2bResult?.success ? b2bResult.data : { members: [], stats: { total_members: 0, average_xp: 0, total_certifications: 0, active_simulations: 0 } };
  
  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Corporativo</h1>
          <p className="text-muted-foreground">Monitore o desempenho e a evolução técnica da sua equipe.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><Download size={16} /> Relatórios</Button>
          <Button className="gap-2"><Users size={16} /> Convidar Técnico</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Equipe Ativa</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {stats.total_members}
              <Users className="text-primary opacity-50" size={20} />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Média XP</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {Math.floor(stats.average_xp).toLocaleString()}
              <TrendingUp className="text-primary opacity-50" size={20} />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Certificações</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {stats.total_certifications}
              <Award className="text-primary opacity-50" size={20} />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Simulações Hoje</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {stats.active_simulations}
              <Clock className="text-primary opacity-50" size={20} />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Team Management */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-lg">Gestão de Colaboradores</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Pesquisar membro..." 
                  className="pl-9" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon"><Filter size={16} /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4 w-64">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{member.full_name}</p>
                    <p className="text-[10px] text-muted-foreground">Nível {member.level}</p>
                  </div>
                </div>
                
                <div className="flex-1 px-8 hidden lg:block">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter mb-1">
                    <span>Taxa de Acerto</span>
                    <span>{member.completion_rate}%</span>
                  </div>
                  <Progress value={member.completion_rate} className="h-1.5" />
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right w-24">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">XP Total</p>
                    <p className="font-mono font-bold text-sm">{member.xp.toLocaleString()}</p>
                  </div>
                  <div className="text-right w-32 hidden md:block">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Último Acesso</p>
                    <p className="text-xs">{new Date(member.last_activity).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BarChart3 size={14} /> Detalhes
                  </Button>
                </div>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="p-12 text-center text-muted-foreground italic">
                Nenhum colaborador encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
