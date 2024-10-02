import type { PetsRepository } from '@/repositories/pets-repository'
import type { PhotosRepository } from '@/repositories/photos-repository'
import type { Pet, Photo } from '@prisma/client'

import { PetNotFoundError } from './errors/pet-not-found-error'

interface GetDetailsPetUseCaseRequest {
  petId: string
}

interface GetDetailsPetUseCaseResponse {
  pet: Pet
  photos: Photo[]
}

export class GetDetailsPet {
  constructor(
    private petsRepository: PetsRepository,
    private photosRepository: PhotosRepository
  ) {}

  async execute({
    petId,
  }: GetDetailsPetUseCaseRequest): Promise<GetDetailsPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new PetNotFoundError()
    }

    const photos = await this.photosRepository.findById(pet.id)

    return {
      pet,
      photos,
    }
  }
}
