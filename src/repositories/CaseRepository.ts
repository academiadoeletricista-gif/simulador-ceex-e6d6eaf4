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
      code: item.code || content.code || 'PD-000',
      title: item.title,
      description: item.description || content.description,
      laboratoryId: item.laboratory_id,
      difficulty: item.level as CaseDifficulty,
      estimatedTime: item.time_estimate,
      xpReward: item.xp_reward,
      
      // Scenario-Based Data
      workOrder: content.workOrder || {
        customer: 'Planta Industrial',
        machine: item.title,
        symptoms: item.description || 'Falha desconhecida'
      },
      decisionTree: content.decisionTree || [],
      possibleFaults: content.possibleFaults || [],
      evidenceData: content.evidenceData || [],
      availableTools: content.availableTools || ['Multímetro', 'Inspeção Visual'],

      topology: content.topology,
      category: item.category,
      status: (item.published ? 'published' : 'draft') as any,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }


}

export const caseRepository = new CaseRepository();
