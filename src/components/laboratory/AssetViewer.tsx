import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Image as ImageIcon, Video, Music, FileJson, ExternalLink, Download, History, Info } from "lucide-react";
import { Asset, AssetCategory } from "@/types/assets";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AssetViewerProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

const getAssetIcon = (category: AssetCategory) => {
  if (category.includes('Diagrama') || category === 'Símbolo Elétrico' || category === 'Fluxograma') return <FileJson className="w-4 h-4" />;
  if (category.includes('Foto') || category.includes('Painel')) return <ImageIcon className="w-4 h-4" />;
  if (category === 'Vídeo' || category === 'Animação') return <Video className="w-4 h-4" />;
  if (category === 'Áudio') return <Music className="w-4 h-4" />;
  if (['PDF', 'Manual', 'Catálogo', 'Datasheet', 'Norma', 'Documento Técnico'].includes(category)) return <FileText className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
};

export const AssetViewer: React.FC<AssetViewerProps> = ({ asset, isOpen, onClose }) => {
  if (!asset) return null;

  const renderContent = () => {
    const { category, publicUrl, type } = asset;

    if (type.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg min-h-[400px]">
          <img 
            src={publicUrl} 
            alt={asset.title} 
            className="max-w-full max-h-[70vh] object-contain rounded-md shadow-lg"
          />
        </div>
      );
    }

    if (type === 'application/pdf' || category === 'PDF' || category === 'Manual' || category === 'Datasheet') {
      return (
        <div className="w-full h-[70vh] rounded-lg overflow-hidden border">
          <iframe 
            src={`${publicUrl}#toolbar=0`} 
            className="w-full h-full" 
            title={asset.title}
          />
        </div>
      );
    }

    if (type.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center p-4 bg-black rounded-lg min-h-[400px]">
          <video 
            src={publicUrl} 
            controls 
            className="max-w-full max-h-[70vh]"
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg">
          <Music className="w-16 h-16 text-muted-foreground mb-4" />
          <audio src={publicUrl} controls className="w-full max-w-md" />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg text-center">
        <Info className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Visualização não disponível para este formato</p>
        <p className="text-sm text-muted-foreground mt-2">Você pode baixar o arquivo para visualizá-lo localmente.</p>
        <Button variant="outline" className="mt-6" asChild>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" /> Baixar Arquivo
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {getAssetIcon(asset.category)}
            </div>
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {asset.title}
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                  {asset.code}
                </Badge>
              </DialogTitle>
              <DialogDescription className="line-clamp-1">
                {asset.description || 'Recurso técnico industrial do Laboratório CEEX'}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-8">
            <Button variant="ghost" size="icon" asChild>
              <a href={asset.publicUrl} target="_blank" rel="noopener noreferrer" title="Abrir em nova aba">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" title="Histórico de versões">
              <History className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden p-6">
            <ScrollArea className="h-full">
              {renderContent()}
            </ScrollArea>
          </div>

          <div className="w-80 border-l bg-muted/10 p-6 hidden md:block">
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1 text-xs">Detalhes</TabsTrigger>
                <TabsTrigger value="metadata" className="flex-1 text-xs">Metadados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Categoria</h4>
                  <Badge variant="secondary" className="w-full justify-start py-1 px-3 h-auto font-normal">
                    {asset.category}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Formato</h4>
                  <div className="text-sm font-medium uppercase">{asset.format} ({asset.type})</div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Versão</h4>
                  <div className="text-sm font-medium">v{asset.version}</div>
                </div>

                {asset.author && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Autor</h4>
                    <div className="text-sm font-medium">{asset.author}</div>
                  </div>
                )}

                {asset.tags && asset.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="metadata" className="mt-4">
                <div className="bg-background border rounded-md p-3">
                  <pre className="text-[10px] font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(asset.metadata, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-auto pt-6 border-t mt-8">
              <Button className="w-full" asChild>
                <a href={asset.publicUrl} download={asset.title}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
