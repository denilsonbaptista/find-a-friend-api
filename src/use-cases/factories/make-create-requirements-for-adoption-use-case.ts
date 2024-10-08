import { PrismaRequirementsForAdoptionRepository } from '@/repositories/prisma/prisma-requirements-for-adoption-repository'
import { CreateRequirementsForAdoptionUseCase } from '../create-requirements-for-adoption'

export function makeCreateRequirementsForAdoptionUseCase() {
  const requirementsForAdoptionRepository =
    new PrismaRequirementsForAdoptionRepository()
  const createRequirementsForAdoptionUseCase =
    new CreateRequirementsForAdoptionUseCase(requirementsForAdoptionRepository)

  return createRequirementsForAdoptionUseCase
}
