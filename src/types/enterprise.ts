import { Case } from '../types';

export interface AIAnalysis {
  churnProbability: number;
  failureRisk: number;
  recommendations: string[];
  predictedPerformance: number;
}

export interface MetricPoint {
  date: string;
  value: number;
}

export interface BusinessMetrics {
  mrr: number;
  arr: number;
  churn: number;
  ltv: number;
  cac: number;
  activeUsers: number;
  revenue: MetricPoint[];
}

export interface LearningAnalytics {
  skillMastery: Record<string, number>;
  timePerSkill: Record<string, number>;
  commonErrors: { error: string; count: number }[];
  learningCurve: MetricPoint[];
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  storage: number;
  latency: number;
  errorRate: number;
  aiCosts: number;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  active: boolean;
}

export interface OrganizationSettings {
  logo?: string;
  primaryColor?: string;
  domain?: string;
  whiteLabel: boolean;
}
