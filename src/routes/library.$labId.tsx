import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Zap, 
  Clock, 
  Play
} from "lucide-react";
import { useLaboratory } from "@/hooks/useLaboratory";
import { useCasesByLab } from "@/hooks/useCase";
import { useStartSession } from "@/hooks/useSession";

export const Route = createFileRoute("/library/$labId")({
  component: LabDetail,
});

function LabDetail() {
  const { labId } = Route.useParams();
  const navigate = useNavigate();

  const { data: labResult, isLoading: labLoading } = useLaboratory(labId);
  const { data: casesResult, isLoading: casesLoading } = useCasesByLab(labId);
  const startSessionMutation = useStartSession();

  const lab = labResult?.success ? labResult.data : null;
  const cases = (casesResult?.success && casesResult.data) ? casesResult.data : [];

  if (labLoading || casesLoading) {
    return <div className="p-8">Carregando laboratório...</div>;
  }

  if (!lab) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Laboratório não encontrado</h1>
        <Button onClick={() => navigate({ to: '/library' })} className="mt-4">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/library' })}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <h1 className="text-4xl font-bold">{lab.name}</h1>
            <p className="text-muted-foreground text-lg">{lab.description}</p>
          </div>
          <Card className="w-64">
            <CardContent className="pt-6">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>PROGRESSO</span>
                <span>{lab.progress}%</span>
              </div>
              <Progress value={lab.progress} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t">
          {/* CASO PILOTO FORÇADO SEM TABS */}
          <Card className="border-2 border-primary shadow-xl scale-105">
            <CardHeader>
              <div className="flex justify-between mb-2">
                <Badge variant="outline">PD-001</Badge>
                <Badge>Iniciante</Badge>
              </div>
              <CardTitle>Motor não liga - Fusível Queimado</CardTitle>
              <CardDescription>Simulação de diagnóstico industrial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 300 XP</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 15 min</span>
              </div>
              <Button 
                className="w-full py-6 text-lg font-bold"
                onClick={async () => {
                  const id = cases.find(c => c.code === 'PD-001')?.id || 'f7f02b3c-622e-4375-9e6b-07b949f57d60';
                  try { await startSessionMutation.mutateAsync(id); } catch(e) {}
                  navigate({ to: '/simulations', search: { id } });
                }}
              >
                <Play className="w-6 h-6 mr-2 fill-current" /> INICIAR SIMULAÇÃO
              </Button>
            </CardContent>
          </Card>

          {cases.filter(c => c.code !== 'PD-001').map(c => (
            <Card key={c.id}>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">{c.code}</Badge>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={async () => {
                    try { await startSessionMutation.mutateAsync(c.id); } catch(e) {}
                    navigate({ to: '/simulations', search: { id: c.id } });
                  }}
                >
                  Iniciar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
