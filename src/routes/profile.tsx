import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { getLevelTitle } from "@/store/useAppStore";
import { 
  Trophy, 
  Target, 
  Zap, 
  Clock, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Edit,
  Mail,
  Phone,
  Settings,
  Share2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profileResult, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  if (isLoading) {
    return <div className="p-8 space-y-8 max-w-5xl mx-auto"><Skeleton className="w-full h-[600px]" /></div>;
  }

  const profile = profileResult?.success ? profileResult.data : null;

  if (!profile) return null;

  const levelTitle = getLevelTitle(profile.level);
  const nextLevelXp = 1000;
  const xpProgress = (profile.xp / nextLevelXp) * 100;

  const handleUpdateProfile = async (data: any) => {
    const result = await updateProfileMutation.mutateAsync(data);
    if (result.success) {
      toast.success("Perfil atualizado com sucesso!");
    } else {
      toast.error(result.error || "Erro ao atualizar perfil");
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-primary/10 group-hover:border-primary/30 transition-all">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-4xl">{profile.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={14} />
          </Button>
        </div>

        <div className="flex-grow space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{profile.full_name}</h1>
              <p className="text-muted-foreground">{profile.bio || "Entusiasta de comandos elétricos e automação industrial."}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 size={14} /> Compartilhar
              </Button>
              <Button size="sm" className="gap-2" onClick={() => handleUpdateProfile({ full_name: profile.full_name })}>
                <Settings size={14} /> Configurações
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={14} /> {profile.city}, {profile.state}</span>
            <span className="flex items-center gap-1"><Briefcase size={14} /> {profile.role} em {profile.company}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Membro desde Jan 2024</span>
          </div>

          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
              {levelTitle}
            </Badge>
            <Badge variant="outline" className="font-mono">Nível {profile.level}</Badge>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Progresso da Carreira</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">XP de Carreira</span>
                <span className="text-muted-foreground">{profile.xp} / {nextLevelXp} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="text-center space-y-1">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap size={20} />
                </div>
                <p className="text-2xl font-bold">{profile.total_diagnoses}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Diagnósticos</p>
              </div>
              <div className="text-center space-y-1">
                <div className="h-10 w-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target size={20} />
                </div>
                <p className="text-2xl font-bold">{profile.accuracy}%</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Precisão</p>
              </div>
              <div className="text-center space-y-1">
                <div className="h-10 w-10 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Trophy size={20} />
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Conquistas</p>
              </div>
              <div className="text-center space-y-1">
                <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock size={20} />
                </div>
                <p className="text-2xl font-bold">{(profile.avg_time / 60).toFixed(0)}m</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Tempo Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground leading-none mb-1">E-mail</p>
                  <p className="font-medium truncate">aluno@ceex.com.br</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground leading-none mb-1">Telefone</p>
                  <p className="font-medium">{profile.phone || "(11) 99999-9999"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
