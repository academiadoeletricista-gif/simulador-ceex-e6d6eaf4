import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Zap,
  Download, 
  ArrowRight,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/certifications")({
  component: CertificationsPage,
});

const CERTIFICATIONS = [
  { 
    id: "c1",
    level: "Bronze", 
    status: "Concluído", 
    color: "text-amber-700", 
    bg: "bg-amber-700/10",
    description: "Fundamentos de Diagnóstico e Comandos Básicos.",
    requirements: "XP > 1000, 10 Casos concluídos",
    issuedAt: "12/05/2026",
    code: "CMD-BR-4242",
  },
  { 
    id: "c2",
    level: "Prata", 
    status: "Em progresso", 
    color: "text-gray-400", 
    bg: "bg-gray-400/10",
    description: "Sistemas Reversão, Estrela-Triângulo e Temporização.",
    requirements: "XP > 5000, 50 Casos concluídos",
    progress: 65,
  },
  { 
    id: "c3",
    level: "Ouro", 
    status: "Bloqueado", 
    color: "text-yellow-500", 
    bg: "bg-yellow-500/10",
    description: "Diagnóstico Avançado, Proteções e Soft Starters.",
    requirements: "XP > 15000, 100 Casos concluídos",
  },
  { 
    id: "c4",
    level: "Especialista", 
    status: "Bloqueado", 
    color: "text-primary", 
    bg: "bg-primary/10",
    description: "Inversores de Frequência, Redes e CLP Industrial.",
    requirements: "XP > 50000, 250 Casos concluídos",
  },
];

const EXAMS = [
  {
    id: "e1",
    title: "Avaliação Teórica: Motores Trifásicos",
    duration: "45 min",
    questions: 20,
    difficulty: "Médio",
    status: "Disponível",
  },
  {
    id: "e2",
    title: "Prática: Diagnóstico em Painel Real",
    duration: "120 min",
    questions: 5,
    difficulty: "Avançado",
    status: "Bloqueado",
  }
];

function CertificationsPage() {
  const [activeTab, setActiveTab] = useState<'certs' | 'exams'>('certs');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificações e Exames</h1>
          <p className="text-muted-foreground">Valide sua expertise técnica com selos reconhecidos pela indústria.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <Button 
            variant={activeTab === 'certs' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveTab('certs')}
            className="px-6"
          >
            Certificações
          </Button>
          <Button 
            variant={activeTab === 'exams' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveTab('exams')}
            className="px-6"
          >
            Exames
          </Button>
        </div>
      </header>

      {activeTab === 'certs' ? (
        <div className="space-y-6">
          {CERTIFICATIONS.map((cert) => (
            <Card key={cert.id} className={cn(
              "relative overflow-hidden group border-none bg-card/50",
              cert.status === 'Bloqueado' && "opacity-75"
            )}>
              <div className={cn("absolute inset-y-0 left-0 w-1", cert.color.replace('text-', 'bg-'))} />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border-2", cert.bg, cert.color.replace('text-', 'border-'))}>
                    <Award className="h-10 w-10" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{cert.level}</h3>
                      <Badge variant={cert.status === 'Concluído' ? 'default' : 'secondary'}>
                        {cert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
                        <Zap className="h-3 w-3" /> {cert.requirements}
                      </span>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col gap-2">
                    {cert.status === 'Concluído' ? (
                      <>
                        <Button className="gap-2" variant="outline" size="sm">
                          <Download className="h-4 w-4" /> Download PDF
                        </Button>
                        <Button className="gap-2" variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" /> Validar Público
                        </Button>
                      </>
                    ) : cert.status === 'Em progresso' ? (
                      <div className="w-full md:w-48 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Progresso</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} className="h-1.5" />
                        <Button className="w-full gap-2 mt-2" size="sm">
                          Continuar Jornada <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button className="gap-2" variant="ghost" size="sm" disabled>
                        <Lock className="h-4 w-4" /> Requisitos insuficientes
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXAMS.map((exam) => (
            <Card key={exam.id} className="bg-card/50">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{exam.difficulty}</Badge>
                  {exam.status === 'Bloqueado' && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>Esta avaliação definirá seu ranque profissional na plataforma.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-background/50 border flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duração</p>
                      <p className="text-sm font-semibold">{exam.duration}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Questões</p>
                      <p className="text-sm font-semibold">{exam.questions}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Certifique-se de estar em um ambiente calmo. Uma vez iniciada, a prova não poderá ser pausada.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2" disabled={exam.status === 'Bloqueado'}>
                  Iniciar Avaliação <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Public Validation CTA */}
      <section className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Validação Pública de Certificados</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Empresas e recrutadores podem validar a autenticidade de qualquer certificado emitido pelo Laboratório através do código de verificação único.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Digite o código (ex: CMD-BR-4242)"
              className="w-full bg-background border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <Button className="w-full sm:w-auto">Validar Agora</Button>
        </div>
      </section>
    </div>
  );
}
