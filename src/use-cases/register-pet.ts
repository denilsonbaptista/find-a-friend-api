import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import type { Pet } from '@prisma/client'

import { OrganizationNotFoundError } from './errors/organization-not-found-error'

interface RegisterPetUseCaseRequest {
  name: string
  about: string
  age: 'Puppy' | 'Adult' | 'Old'
  size: 'Small' | 'Medium' | 'Large'
  energy: 'Low' | 'High' | 'Medium'
  environment: 'Small' | 'Medium' | 'Large'
  organizationId: string
}

interface RegisterPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(
    private petRepository: PetsRepository,
    private organizationRepository: OrganizationsRepository
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energy,
    environment,
    organizationId,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const organization =
      await this.organizationRepository.findById(organizationId)

    if (!organization) throw new OrganizationNotFoundError()

    const pet = await this.petRepository.create({
      name,
      about,
      age,
      size,
      energy_level: energy,
      environment,
      organization_id: organizationId,
    })

    return {
      pet,
    }
  }
}
