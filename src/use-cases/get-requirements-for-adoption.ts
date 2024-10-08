import type { RequirementsForAdoptionRepository } from '@/repositories/requirements-for-adoption-repository'
import type { RequirementsForAdoption } from '@prisma/client'

interface GetRequirementsForAdoptionUseCaseRequest {
  petId: string
}

interface GetRequirementsForAdoptionUseCaseResponse {
  requirements: RequirementsForAdoption[]
}

export class GetRequirementsForAdoptionUseCase {
  constructor(
    private requirementsForAdoptionRepository: RequirementsForAdoptionRepository
  ) {}

  async execute({
    petId,
  }: GetRequirementsForAdoptionUseCaseRequest): Promise<GetRequirementsForAdoptionUseCaseResponse> {
    const requirements =
      await this.requirementsForAdoptionRepository.findByPetId(petId)

    return {
      requirements,
    }
  }
}
