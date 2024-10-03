import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import type { PhotosRepository } from '@/repositories/photos-repository'
import type { RequirementsForAdoptionRepository } from '@/repositories/requirements-for-adoption-repository'
import type {
  Organization,
  Pet,
  Photo,
  RequirementsForAdoption,
} from '@prisma/client'

import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { PetNotFoundError } from './errors/pet-not-found-error'

interface GetDetailsPetUseCaseRequest {
  petId: string
}

interface GetDetailsPetUseCaseResponse {
  pet: Pet & {
    photos: Photo[]
    organization: Organization
    requirements_for_adoption: RequirementsForAdoption[]
  }
}

export class GetDetailsPet {
  constructor(
    private petsRepository: PetsRepository,
    private photosRepository: PhotosRepository,
    private organizationRepository: OrganizationsRepository,
    private requirementsForAdoptionRepository: RequirementsForAdoptionRepository
  ) {}

  async execute({
    petId,
  }: GetDetailsPetUseCaseRequest): Promise<GetDetailsPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) throw new PetNotFoundError()

    const photos = await this.photosRepository.findById(pet.id)

    const organization = await this.organizationRepository.findById(
      pet.organization_id
    )

    if (!organization) throw new OrganizationNotFoundError()

    const requirementsForAdoption =
      await this.requirementsForAdoptionRepository.findById(pet.id)

    return {
      pet: {
        ...pet,
        photos,
        organization,
        requirements_for_adoption: requirementsForAdoption,
      },
    }
  }
}
