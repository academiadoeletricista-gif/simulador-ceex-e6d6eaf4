export type AssetCategory =
  | 'Diagrama de Potência'
  | 'Diagrama de Comando'
  | 'Diagrama Funcional'
  | 'Diagrama Multifilar'
  | 'Diagrama Unifilar'
  | 'Painel Frontal'
  | 'Painel Interno'
  | 'Foto'
  | 'Vídeo'
  | 'Áudio'
  | 'Animação'
  | 'PDF'
  | 'Manual'
  | 'Catálogo'
  | 'Datasheet'
  | 'Checklist'
  | 'Norma'
  | 'Fluxograma'
  | 'Modelo 3D'
  | 'Símbolo Elétrico'
  | 'Documento Técnico';

export type AssetStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface Asset {
  id: string;
  code: string;
  title: string;
  description?: string;
  category: AssetCategory;
  type: string; // mime type
  format: string; // extension
  bucket: string;
  path: string;
  publicUrl?: string;
  thumbnailUrl?: string;
  version: string;
  author?: string;
  language?: string;
  metadata: Record<string, any>;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface AssetVersion {
  id: string;
  assetId: string;
  version: string;
  path: string;
  publicUrl?: string;
  changes?: string;
  createdAt: string;
  author?: string;
}

export interface DiagramHotspot {
  id: string;
  assetId: string;
  tag?: string;
  type?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  componentId?: string;
  metadata: Record<string, any>;
}

export interface PanelHotspot {
  id: string;
  assetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  componentId?: string;
  tooltip?: string;
  metadata: Record<string, any>;
}

export interface AssetLink {
  id: string;
  assetId: string;
  entityType: 'laboratory' | 'circuit' | 'case' | 'component' | 'measurement' | 'lesson';
  entityId: string;
  createdAt: string;
}
