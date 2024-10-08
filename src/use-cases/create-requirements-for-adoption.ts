import type { RequirementsForAdoptionRepository } from '@/repositories/requirements-for-adoption-repository'
import type { RequirementsForAdoption } from '@prisma/client'

interface CreateRequirementsForAdoptionUseCaseRequest {
  requirements: string[]
  petId: string
}

interface CreateRequirementsForAdoptionUseCaseResponse {
  requirements: RequirementsForAdoption[]
}

export class CreateRequirementsForAdoptionUseCase {
  constructor(
    private requirementsForAdoptionRepository: RequirementsForAdoptionRepository
  ) {}

  async execute({
    requirements,
    petId,
  }: CreateRequirementsForAdoptionUseCaseRequest): Promise<CreateRequirementsForAdoptionUseCaseResponse> {
    const insert = requirements.map(requirement => {
      return {
        requirement,
        pet_id: petId,
      }
    })

    const requirementsForAdoption =
      await this.requirementsForAdoptionRepository.create(insert)

    return {
      requirements: requirementsForAdoption,
    }
  }
}
