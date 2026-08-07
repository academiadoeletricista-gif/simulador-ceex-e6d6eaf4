import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { Laboratory } from "@/types/laboratory";

export class LaboratoryRepository {
  async findAll(): Promise<Result<Laboratory[]>> {
    try {
      const { data, error } = await supabase
        .from('laboratories')
        .select('*');

      if (error) return fail(error.message, error.code);
      
      const labs = (data || []).map(l => this.mapToDomain(l));
      return ok(labs);
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findById(id: string): Promise<Result<Laboratory | null>> {
    try {
      const { data, error } = await supabase
        .from('laboratories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return ok(null);
        return fail(error.message, error.code);
      }
      return ok(this.mapToDomain(data));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findByName(name: string): Promise<Result<Laboratory | null>> {
    try {
      const { data, error } = await supabase
        .from('laboratories')
        .select('*')
        .ilike('name', `%${name}%`)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return ok(null);
        return fail(error.message, error.code);
      }
      return ok(this.mapToDomain(data));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  private mapToDomain(l: any): Laboratory {
    return {
      id: l.id,
      code: l.code || 'LAB-00',
      slug: l.slug || '',
      name: l.name,
      description: l.description || '',
      learningObjectives: l.learning_objectives || [],
      competencies: l.competencies || [],
      prerequisites: l.prerequisites || [],
      level: l.level as any,
      estimatedDuration: l.estimated_duration || l.estimated_time || '',
      estimatedTime: l.estimated_time || '',
      totalXp: l.total_xp || 0,
      defectCount: 0, 
      componentCount: l.component_count || 0,
      measurementPointCount: l.measurement_point_count || 0,
      diagramCount: l.diagram_count || 0,
      resourceCount: l.resource_count || 0,
      status: (l.status as any) || 'active',
      version: l.version || '1.0.0',
      author: l.author || '',
      createdAt: l.created_at || new Date().toISOString(),
      updatedAt: l.updated_at || new Date().toISOString(),
      progress: 0, 
      averageAccuracy: 0,
      bestStreak: 0,
      achievements: [],
    };
  }
}

export const laboratoryRepository = new LaboratoryRepository();
