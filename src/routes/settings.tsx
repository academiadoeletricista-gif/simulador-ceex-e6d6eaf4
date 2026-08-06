import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAppStore } from "@/store/useAppStore";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  LogOut,
  Save,
  CreditCard,
  Building
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profileResult, isLoading: profileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { theme, setTheme, language, setLanguage } = useAppStore();

  if (profileLoading) {
    return <div className="p-8 space-y-8 max-w-4xl mx-auto"><Skeleton className="w-full h-[600px]" /></div>;
  }

  const profile = profileResult?.success ? profileResult.data : null;

  const handleUpdateProfile = async (data: any) => {
    const result = await updateProfileMutation.mutateAsync(data);
    if (result.success) {
      toast.success("Configurações atualizadas com sucesso!");
    } else {
      toast.error(result.error?.message || "Erro ao atualizar");
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua conta, preferências e privacidade.</p>
      </header>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="account" className="gap-2"><User size={16} /> Conta</TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2"><Globe size={16} /> Preferências</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell size={16} /> Notificações</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield size={16} /> Segurança</TabsTrigger>
          <TabsTrigger value="organization" className="gap-2"><Building size={16} /> B2B</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Perfil Público</CardTitle>
              <CardDescription>Como outros usuários verão você na plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue={profile?.full_name} placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo / Função</Label>
                  <Input id="role" defaultValue={profile?.role} placeholder="Ex: Eletricista de Manutenção" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" defaultValue={profile?.company} placeholder="Sua empresa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Cidade/Estado</Label>
                  <Input id="location" defaultValue={`${profile?.city || ''}, ${profile?.state || ''}`} placeholder="Ex: São Paulo, SP" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <textarea 
                  id="bio"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={profile?.bio}
                  placeholder="Conte um pouco sobre sua experiência..."
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="gap-2" onClick={() => handleUpdateProfile({})}>
                <Save size={16} /> Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Interface e Localização</CardTitle>
              <CardDescription>Personalize sua experiência visual no CEEX.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun size={16} className={cn(theme === 'light' ? "text-primary" : "text-muted-foreground")} />
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                  />
                  <Moon size={16} className={cn(theme === 'dark' ? "text-primary" : "text-muted-foreground")} />
                </div>
              </div>
              
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Idioma do Sistema</Label>
                  <p className="text-sm text-muted-foreground">Escolha o idioma das interfaces e feedbacks.</p>
                </div>
                <select 
                  className="bg-background border rounded-md px-3 py-1 text-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações por E-mail</CardTitle>
              <CardDescription>Escolha quais alertas você deseja receber.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Alertas de Progressão</Label>
                  <p className="text-sm text-muted-foreground">Receba avisos quando subir de nível ou ganhar XP.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Novos Desafios</Label>
                  <p className="text-sm text-muted-foreground">Seja avisado sobre novos casos na biblioteca.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Relatórios B2B</Label>
                  <p className="text-sm text-muted-foreground">Receba relatórios semanais de desempenho (Enterprise).</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Gerencie suas credenciais e acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Acesso</Label>
                <Input id="email" value="aluno@ceex.com.br" disabled />
                <p className="text-[10px] text-muted-foreground italic">O e-mail só pode ser alterado via suporte técnico.</p>
              </div>
              <Button variant="outline">Alterar Senha</Button>
            </CardContent>
          </Card>
          
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis relacionadas à sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="gap-2">
                <LogOut size={16} /> Encerrar Todas as Sessões
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={20} className="text-primary" /> Painel Corporativo
              </CardTitle>
              <CardDescription>Gerenciamento de assinaturas e times para empresas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Plano Atual: Individual Pro</p>
                  <p className="text-[10px] text-muted-foreground">Próximo faturamento: 12/05/2024</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <CreditCard size={14} /> Gerenciar Assinatura
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold">Deseja migrar para um plano Corporativo?</h3>
                <p className="text-xs text-muted-foreground">
                  Obtenha analytics avançado para seus funcionários, relatórios de conformidade técnica e gestão de licenças em massa.
                </p>
                <Button className="w-full md:w-auto">Falar com Consultor B2B</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
