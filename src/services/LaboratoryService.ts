import { laboratoryRepository } from "@/repositories/LaboratoryRepository";
import { Result } from "@/lib/result/Result";
import { Laboratory } from "@/types/laboratory";

export const LaboratoryService = {
  async getAll(): Promise<Result<Laboratory[]>> {
    return laboratoryRepository.findAll();
  },

  async getById(id: string): Promise<Result<Laboratory | null>> {
    return laboratoryRepository.findById(id);
  }
};
