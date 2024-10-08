import { PrismaRequirementsForAdoptionRepository } from '@/repositories/prisma/prisma-requirements-for-adoption-repository'
import { GetRequirementsForAdoptionUseCase } from '../get-requirements-for-adoption'

export function makeGetRequirementsForAdoptionUseCase() {
  const requirementsForAdoptionRepository =
    new PrismaRequirementsForAdoptionRepository()
  const getRequirementsForAdoptionUseCase =
    new GetRequirementsForAdoptionUseCase(requirementsForAdoptionRepository)

  return getRequirementsForAdoptionUseCase
}
