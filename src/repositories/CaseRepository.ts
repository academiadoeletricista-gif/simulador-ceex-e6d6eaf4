import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { DiagnosticCase, CaseDifficulty } from "@/types/diagnosis";


export class CaseRepository {
  async findAll(): Promise<Result<DiagnosticCase[]>> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*, case_hypotheses(*)')
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
        .select('*, case_hypotheses(*)')
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
      console.log('Fetching cases for lab:', labId);
      const { data, error } = await supabase
        .from('cases')
        .select('*, case_hypotheses(*)')
        .eq('published', true);

      if (error) {
        console.error('Error fetching cases:', error);
        return fail(error.message, error.code);
      }
      
      console.log(`Found ${data?.length || 0} total published cases`);
      
      if (data && data.length > 0) {
        // First try exact match
        let filtered = data.filter(c => c.laboratory_id === labId);
        
        // If no cases for this lab, but we are in Partida Direta, force PD-001 for now
        if (filtered.length === 0 && (labId === 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6' || labId === 'LAB-01')) {
          console.log('Forcing PD-001 for Partida Direta');
          filtered = data.filter(c => c.code === 'PD-001');
        }

        if (filtered.length > 0) {
          return ok(filtered.map(this.mapToCamelCase));
        }
      }

      return ok([]);
    } catch (e: any) {
      console.error('Exception in findByLaboratoryId:', e);
      return fail(e.message);
    }
  }

  private mapToCamelCase(item: any): DiagnosticCase {
    const content = item.content || {};
    const hypotheses = (item.case_hypotheses || []).map((h: any) => ({
      id: h.id,
      title: h.title,
      description: h.description,
      isCorrect: h.is_correct,
      isRootCause: h.is_root_cause,
      validationLogic: h.validation_logic
    }));
    
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
      hints: content.hints || [],
      hypotheses: hypotheses.length > 0 ? hypotheses : content.hypotheses || [],
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
