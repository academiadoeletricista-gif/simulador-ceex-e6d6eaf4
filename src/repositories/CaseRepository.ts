import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { DiagnosticCase, CaseDifficulty } from "@/types/diagnosis";


export class CaseRepository {
  async findAll(): Promise<Result<DiagnosticCase[]>> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return fail(error.message, error.code);
      return ok(data.map(this.mapToCamelCase));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findById(id: string): Promise<Result<DiagnosticCase | null>> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return ok(null);
        return fail(error.message, error.code);
      }
      return ok(this.mapToCamelCase(data));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findByLaboratoryId(labId: string): Promise<Result<DiagnosticCase[]>> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('laboratory_id', labId);

      if (error) return fail(error.message, error.code);
      return ok(data.map(this.mapToCamelCase));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  private mapToCamelCase(item: any): DiagnosticCase {
    const content = item.content || {};
    
    return {
      id: item.id,
      code: item.code || content.code,
      title: item.title,
      description: item.description || content.description,
      laboratoryId: item.laboratory_id,
      topology: content.topology || 'DOL',
      difficulty: item.level as CaseDifficulty,
      estimatedTime: item.time_estimate,
      xpReward: item.xp_reward,
      objective: content.objective || item.description,
      
      circuit: content.circuit || { baseVoltage: 220, nodes: [] },
      components: content.components || [],
      
      fault: content.fault || {
        type: 'NONE',
        componentTag: '',
        description: 'Nenhuma falha'
      },
      
      initialState: content.initialState || {},
      expectedMeasurements: content.expectedMeasurements || [],
      
      availableTools: content.availableTools || ['Multímetro', 'Inspeção Visual'],
      repairActions: content.repairActions || [],
      
      completionCriteria: content.completionCriteria || {
        faultRemoved: true,
        motorRunning: true
      },

      category: item.category,
      status: (item.published ? 'published' : 'draft') as any,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      symptoms: Array.isArray(item.symptoms) 
        ? item.symptoms.map((s: string, i: number) => ({ id: `${item.id}-s-${i}`, description: s }))
        : [],
    };
  }

}

export const caseRepository = new CaseRepository();
