import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import type { PhotosRepository } from '@/repositories/photos-repository'
import type { Pet, Photo } from '@prisma/client'

import { DiskStorage } from '@/providers/disk-storage'
import { NoPhotoProvidedError } from './errors/no-photo-provided-error'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'

interface RegisterPetUseCaseRequest {
  name: string
  about: string
  age: string
  size: 'Small' | 'Medium' | 'Large'
  energyLevel: 'Low' | 'High' | 'Medium'
  environment: string
  organizationId: string
  photos: string[]
}

type RegisterPetUseCaseResponse = {
  pet: Pet
  photos: Photo[]
}

export class RegisterPetUseCase {
  constructor(
    private petRepository: PetsRepository,
    private organizationRepository: OrganizationsRepository,
    private photosRepository: PhotosRepository
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energyLevel,
    environment,
    organizationId,
    photos,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const organization =
      await this.organizationRepository.findById(organizationId)

    if (!organization) {
      throw new OrganizationNotFoundError()
    }

    const pet = await this.petRepository.create({
      name,
      about,
      age,
      size,
      energy_level: energyLevel,
      environment,
      organization_id: organizationId,
    })

    if (!photos || photos.length === 0 || photos.some(photo => !photo.trim())) {
      throw new NoPhotoProvidedError()
    }

    const diskStorage = new DiskStorage()

    const savedPhotos = await Promise.all(
      photos.map(async photo => {
        const filename = await diskStorage.saveFile(photo)
        const savedPhoto = await this.photosRepository.createUrl({
          url: filename,
          pet_id: pet.id,
        })
        return savedPhoto
      })
    )

    return {
      pet,
      photos: savedPhotos,
    }
  }
}
