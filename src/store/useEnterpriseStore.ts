import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BusinessMetrics, LearningAnalytics, SystemHealth, AIAnalysis, WebhookConfig, OrganizationSettings } from '../types/enterprise';

interface EnterpriseState {
  // Business Intel
  metrics: BusinessMetrics;
  learning: LearningAnalytics;
  
  // AI & Automation
  aiAnalysis: AIAnalysis;
  webhooks: WebhookConfig[];
  
  // White Label & Config
  orgSettings: OrganizationSettings;
  locale: 'pt' | 'en' | 'es' | 'fr' | 'de';
  
  // System Monitoring
  health: SystemHealth;

  // Actions
  setLocale: (locale: EnterpriseState['locale']) => void;
  updateOrgSettings: (settings: Partial<OrganizationSettings>) => void;
  triggerWebhook: (event: string, payload: any) => void;
  generateAICase: (prompt: string) => Promise<void>;
}

export const useEnterpriseStore = create<EnterpriseState>()(
  persist(
    (set) => ({
      locale: 'pt',
      metrics: {
        mrr: 45000,
        arr: 540000,
        churn: 2.4,
        ltv: 1250,
        cac: 150,
        activeUsers: 12450,
        revenue: Array.from({ length: 12 }, (_, i) => ({ 
          date: `2026-${String(i + 1).padStart(2, '0')}`, 
          value: 35000 + Math.random() * 15000 
        }))
      },
      learning: {
        skillMastery: { 'Motores': 85, 'CLP': 42, 'Sensores': 68, 'Segurança': 92 },
        timePerSkill: { 'Motores': 120, 'CLP': 450, 'Sensores': 180 },
        commonErrors: [
          { error: 'Curto-circuito na bobina', count: 145 },
          { error: 'Fase invertida', count: 89 },
          { error: 'Sobrecarga térmica', count: 67 }
        ],
        learningCurve: Array.from({ length: 30 }, (_, i) => ({ date: `${i + 1}/08`, value: 20 + i * 2 }))
      },
      health: {
        cpu: 12,
        memory: 45,
        storage: 28,
        latency: 45, // ms
        errorRate: 0.02,
        aiCosts: 125.40
      },
      aiAnalysis: {
        churnProbability: 0.05,
        failureRisk: 0.12,
        recommendations: [
          "Reforçar treinamento em CLP para a equipe do Turno B",
          "Aumentar frequência de casos de segurança normativa",
          "Usuário X apresenta 80% de chance de abandono no próximo mês"
        ],
        predictedPerformance: 94
      },
      webhooks: [
        { id: '1', url: 'https://api.empresa.com/hooks/user-sync', events: ['user.created', 'cert.issued'], active: true }
      ],
      orgSettings: {
        whiteLabel: false,
        primaryColor: '#3B82F6'
      },

      setLocale: (locale) => set({ locale }),
      updateOrgSettings: (settings) => set((state) => ({ orgSettings: { ...state.orgSettings, ...settings } })),
      triggerWebhook: (event, payload) => console.log(`[Webhook] ${event}`, payload),
      generateAICase: async (prompt) => {
        console.log("Generating case with prompt:", prompt);
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }),
    { name: 'enterprise-storage' }
  )
);
