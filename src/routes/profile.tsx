import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Award, Clock, Target, Calendar, Zap, Camera, Save } from "lucide-react";
import { useAppStore, getLevelTitle } from "@/store/useAppStore";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, updateProfile } = useAppStore();
  const userName = profile?.full_name || "Comandante";
  const userAvatar = profile?.avatar_url || "";
  const userPhone = profile?.phone || "";
  const userBio = profile?.bio || "";
  const userCity = profile?.city || "";
  const userState = profile?.state || "";
  const userCompany = profile?.company || "";
  const level = profile?.level || 1;
  const levelTitle = getLevelTitle(level);
  const xp = profile?.xp || 0;
  const nextLevelXp = 1000;
  const accuracy = profile?.accuracy || 0;
  const avgTime = profile?.avg_time || 0;
  const totalDiagnoses = profile?.total_diagnoses || 0;
  const streakCount = profile?.streak_current || 0;

  const [formData, setFormData] = useState({
    userName,
    userPhone,
    userBio,
    userCity,
    userState,
    userCompany
  });

  const handleSave = () => {
    updateProfile(formData);
    toast.success("Perfil atualizado com sucesso!");
  };

  const xpProgress = (xp / nextLevelXp) * 100;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative group">
          <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/40 overflow-hidden">
            <Avatar className="h-full w-full">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="text-4xl">{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full border-4 border-background opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={16} />
          </button>
          <div className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground h-10 w-10 rounded-full flex items-center justify-center font-bold border-4 border-background">
            {level}
          </div>
        </div>
        <div className="space-y-2 flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{userName}</h1>
          <p className="text-xl text-muted-foreground italic">{levelTitle}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge className="bg-primary/20 text-primary border-primary/20">Membro Premium</Badge>
            <Badge variant="secondary">Top 10 Mensal</Badge>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados profissionais e de contato.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={formData.userName} 
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={formData.userPhone} 
                    onChange={(e) => setFormData({...formData, userPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input 
                    id="company" 
                    value={formData.userCompany} 
                    onChange={(e) => setFormData({...formData, userCompany: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input 
                      id="city" 
                      value={formData.userCity} 
                      onChange={(e) => setFormData({...formData, userCity: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input 
                      id="state" 
                      value={formData.userState} 
                      onChange={(e) => setFormData({...formData, userState: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  className="min-h-[100px]" 
                  value={formData.userBio} 
                  onChange={(e) => setFormData({...formData, userBio: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t p-4">
              <Button onClick={handleSave} className="gap-2">
                <Save size={16} /> Salvar Alterações
              </Button>
            </CardFooter>
          </Card>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Histórico de Conquistas</h2>
            <Card>
              <div className="divide-y divide-muted">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Caso de Estudo #{i + 100}</p>
                        <p className="text-xs text-muted-foreground">Concluído com sucesso</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Perfeito</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Status de Progressão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Próximo Nível</span>
                  <span>{Math.floor(xpProgress)}%</span>
                </div>
                <Progress value={xpProgress} className="h-2" />
                <p className="text-[10px] text-muted-foreground text-center">Faltam {nextLevelXp - xp} XP para o Nível {level + 1}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-background/50 border flex flex-col items-center">
                  <Trophy className="h-6 w-6 text-primary mb-2" />
                  <span className="text-2xl font-bold">{totalDiagnoses}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Casos</span>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border flex flex-col items-center">
                  <Target className="h-6 w-6 text-secondary mb-2" />
                  <span className="text-2xl font-bold">{accuracy}%</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Precisão</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Carreira Industrial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} /> Tempo Médio
                </div>
                <span className="font-bold">{Math.floor(avgTime / 60)}m {avgTime % 60}s</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} /> Sequência
                </div>
                <span className="font-bold">{streak.current} Dias</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award size={16} /> Especialidade
                </div>
                <span className="font-bold text-primary">Comandos Elétricos</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
