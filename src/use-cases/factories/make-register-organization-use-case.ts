import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { RegisterOrganizationUseCase } from '../register-organization'

export function makeRegisterOrganizationUseCase() {
  const organizationRepository = new PrismaOrganizationsRepository()
  const registerOrganizationUseCase = new RegisterOrganizationUseCase(
    organizationRepository
  )

  return registerOrganizationUseCase
}
