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
  Play, 
  AlertCircle
} from "lucide-react";
import { useLaboratory } from "@/hooks/useLaboratory";
import { useCasesByLab } from "@/hooks/useCase";
import { useStartSession } from "@/hooks/useSession";
import { Skeleton } from "@/components/ui/skeleton";

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
    return <div className="p-8"><Skeleton className="w-full h-64" /></div>;
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
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b p-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/library' })} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-2">
              <Badge variant="outline">{lab.code}</Badge>
              <h1 className="text-4xl font-bold">{lab.name}</h1>
              <p className="text-muted-foreground">{lab.description}</p>
            </div>
            <Card className="w-full md:w-64">
              <CardContent className="pt-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>PROGRESSO</span>
                  <span>{lab.progress}%</span>
                </div>
                <Progress value={lab.progress} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <Tabs defaultValue="defects">
          <TabsList className="mb-8">
            <TabsTrigger value="defects">Defeitos e Diagnósticos</TabsTrigger>
          </TabsList>

          <TabsContent value="defects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CASO PILOTO FORÇADO */}
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between mb-2">
                    <Badge variant="outline">PD-001</Badge>
                    <Badge>Iniciante</Badge>
                  </div>
                  <CardTitle>Motor não liga - Fusível Queimado</CardTitle>
                  <CardDescription>O motor parou após um pico de tensão.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 300 XP</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 15 min</span>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      const id = cases.find(c => c.code === 'PD-001')?.id || 'f7f02b3c-622e-4375-9e6b-07b949f57d60';
                      try { await startSessionMutation.mutateAsync(id); } catch(e) {}
                      navigate({ to: '/simulations', search: { id } });
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" /> Iniciar Simulação
                  </Button>
                </CardContent>
              </Card>

              {/* OUTROS CASOS */}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
