import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { DiagnosticCase } from "@/types/diagnosis";

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
    // Map database snake_case fields to domain camelCase fields
    // Based on the 'cases' table schema in migrations
    return {
      id: item.id,
      laboratoryId: item.laboratory_id,
      code: item.code,
      title: item.title,
      description: item.description,
      category: item.category,
      level: item.level,
      xpReward: item.xp_reward,
      timeEstimate: item.time_estimate,
      complexity: item.complexity || 0,
      author: item.author,
      version: item.version || '1.0.0',
      status: (item.published ? 'published' : 'draft') as any,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      
      // Handle array fields or JSONB content if present
      symptoms: Array.isArray(item.symptoms) 
        ? item.symptoms.map((s: string, i: number) => ({ id: `${item.id}-s-${i}`, description: s }))
        : [],
      
      // Map other fields from JSONB 'content' if it exists
      ...(item.content || {})
    } as unknown as DiagnosticCase;
  }
}

export const caseRepository = new CaseRepository();
