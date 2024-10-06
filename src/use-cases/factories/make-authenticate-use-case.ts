import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const authenticateRepository = new PrismaOrganizationsRepository()
  const authenticateUseCase = new AuthenticateUseCase(authenticateRepository)

  return authenticateUseCase
}
