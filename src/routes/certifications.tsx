import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Calendar, ExternalLink, ShieldCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCertifications } from "@/hooks/useCertification";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export const Route = createFileRoute("/certifications")({
  component: CertificationsPage,
});

function CertificationsPage() {
  const { data: certsResult, isLoading } = useCertifications();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  const certifications = certsResult?.success ? certsResult.data : [];
  const filtered = certifications.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.case_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificações</h1>
          <p className="text-muted-foreground">Documentos oficiais que comprovam sua expertise técnica.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Buscar certificados..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <Card key={cert.id} className="group hover:border-primary/50 transition-all duration-300 overflow-hidden">
              <div className="h-32 bg-primary/5 flex items-center justify-center border-b group-hover:bg-primary/10 transition-colors">
                <Award size={48} className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">Oficial CEEX</Badge>
                  <ShieldCheck size={16} className="text-green-500" />
                </div>
                <CardTitle className="text-xl">{cert.name}</CardTitle>
                <CardDescription>Referente ao caso: {cert.case_title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={14} /> Emitido em: {new Date(cert.issue_date).toLocaleDateString()}
                  </div>
                  {cert.expiry_date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={14} /> Expira em: {new Date(cert.expiry_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                      <Download size={14} /> PDF
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ExternalLink size={14} /> Validar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/20 rounded-2xl border-2 border-dashed">
          <Award size={64} className="text-muted-foreground opacity-20" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Nenhum certificado ainda</h3>
            <p className="text-muted-foreground max-w-sm">Complete desafios de nível Especialista ou Lenda para conquistar suas primeiras certificações.</p>
          </div>
          <Button variant="outline" onClick={() => setSearch("")}>Ver todos os casos</Button>
        </div>
      )}
    </div>
  );
}
