import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { GetOrganizationUseCase } from '../get-organization'

export function makeGetOrganizationUseCase() {
  const organizationRepository = new PrismaOrganizationsRepository()
  const getOrganizationUseCase = new GetOrganizationUseCase(
    organizationRepository
  )

  return getOrganizationUseCase
}
