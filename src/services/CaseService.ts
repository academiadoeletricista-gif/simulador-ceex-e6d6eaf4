import { caseRepository } from "@/repositories/CaseRepository";
import { Result, fail } from "@/lib/result/Result";
import { DiagnosticCase } from "@/types/diagnosis";

export const CaseService = {
  async getAll(): Promise<Result<DiagnosticCase[]>> {
    return caseRepository.findAll();
  },

  async getById(id: string): Promise<Result<DiagnosticCase | null>> {
    if (!id) return fail("Case ID is required");
    return caseRepository.findById(id);
  },

  async getByLab(labId: string): Promise<Result<DiagnosticCase[]>> {
    if (!labId) return fail("Laboratory ID is required");
    return caseRepository.findByLaboratoryId(labId);
  }
};
