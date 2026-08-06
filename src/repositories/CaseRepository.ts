import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { DiagnosticCase } from "@/types/diagnosis";

export class CaseRepository {
  async findAll(): Promise<Result<DiagnosticCase[]>> {
    try {
      const { data, error } = await (supabase as any)
        .from('cases')
        .select(`
          *,
          occurrence:case_occurrences(*),
          symptoms:case_symptoms(*),
          components:case_components(*),
          measurements:case_measurements(*),
          actions:case_actions(*),
          hypotheses:case_hypotheses(*),
          hints:case_hints(*),
          errors:case_errors(*),
          lesson:case_lessons(*)
        `)
        .order('created_at', { ascending: false });

      if (error) return fail(error.message, error.code);
      return ok(data.map(this.mapToCamelCase));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findById(id: string): Promise<Result<DiagnosticCase | null>> {
    try {
      const { data, error } = await (supabase as any)
        .from('cases')
        .select(`
          *,
          occurrence:case_occurrences(*),
          symptoms:case_symptoms(*),
          components:case_components(*),
          measurements:case_measurements(*),
          actions:case_actions(*),
          hypotheses:case_hypotheses(*),
          hints:case_hints(*),
          errors:case_errors(*),
          lesson:case_lessons(*)
        `)
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
      const { data, error } = await (supabase as any)
        .from('diagnostic_cases')
        .select('*')
        .eq('laboratory_id', labId);

      if (error) return fail(error.message, error.code);
      return ok(data.map(this.mapToCamelCase));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  private mapToCamelCase(item: any): DiagnosticCase {
    return {
      id: item.id,
      laboratoryId: item.laboratory_id,
      circuitId: item.circuit_id,
      code: item.code,
      title: item.title,
      description: item.description,
      category: item.category,
      level: item.level,
      xpReward: item.xp_reward,
      timeEstimate: item.time_estimate,
      complexity: item.complexity,
      author: item.author,
      version: item.version,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      occurrence: item.occurrence ? {
        id: item.occurrence.id,
        caseId: item.occurrence.case_id,
        title: item.occurrence.title,
        description: item.occurrence.description,
        operationalContext: item.occurrence.operational_context,
        equipment: item.occurrence.equipment,
        location: item.occurrence.location,
        occurrenceDate: item.occurrence.occurrence_date,
        shift: item.occurrence.shift,
        responsible: item.occurrence.responsible,
        history: item.occurrence.history,
        initialCondition: item.occurrence.initial_condition,
        urgency: item.occurrence.urgency,
        criticality: item.occurrence.criticality,
        operationalRisk: item.occurrence.operational_risk,
        operatorMessage: item.occurrence.operator_message
      } : undefined,
      symptoms: item.symptoms?.map((s: any) => ({ ...s, caseId: s.case_id })),
      components: item.components?.map((c: any) => ({ ...c, caseId: c.case_id, componentTag: c.component_tag })),
      measurements: item.measurements?.map((m: any) => ({ ...m, caseId: m.case_id, pointCode: m.point_code })),
      actions: item.actions?.map((a: any) => ({ ...a, caseId: a.case_id, timeCost: a.time_cost, xpReward: a.xp_reward })),
      hypotheses: item.hypotheses?.map((h: any) => ({ ...h, caseId: h.case_id })),
      hints: item.hints?.map((h: any) => ({ ...h, caseId: h.case_id, xpPenalty: h.xp_penalty })),
      errors: item.errors?.map((e: any) => ({ ...e, caseId: e.case_id, xpPenalty: e.xp_penalty })),
      lesson: item.lesson ? { ...item.lesson, caseId: item.lesson.case_id } : undefined
    } as unknown as DiagnosticCase;
  }
}

export const caseRepository = new CaseRepository();
