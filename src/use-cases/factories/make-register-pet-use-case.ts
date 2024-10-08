import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { RegisterPetUseCase } from '../register-pet'

export function makeRegisterPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const organizationRepository = new PrismaOrganizationsRepository()
  const registerPetUseCase = new RegisterPetUseCase(
    petsRepository,
    organizationRepository
  )

  return registerPetUseCase
}
