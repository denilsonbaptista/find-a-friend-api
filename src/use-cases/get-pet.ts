import type { PetsRepository } from '@/repositories/pets-repository'
import type { Pet } from '@prisma/client'

import { PetNotFoundError } from './errors/pet-not-found-error'

interface GetDetailsPetUseCaseRequest {
  petId: string
}

interface GetDetailsPetUseCaseResponse {
  pet: Pet
}

export class GetPetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId,
  }: GetDetailsPetUseCaseRequest): Promise<GetDetailsPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) throw new PetNotFoundError()

    return {
      pet,
    }
  }
}
