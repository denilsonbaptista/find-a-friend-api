import { randomUUID } from 'node:crypto'

import type { Pet, Photo, Prisma } from '@prisma/client'
import type { PetsRepository, SearchManyParams } from '../pets-repository'
import type { InMemoryOrganizationsRepository } from './in-memory-organizations-repository'
import type { InMemoryPhotosRepository } from './in-memory-photos-repository'

export class InMemoryPetsRepository implements PetsRepository {
  constructor(
    private organizationsRepository?: InMemoryOrganizationsRepository,
    private photosRepository?: InMemoryPhotosRepository
  ) {}

  public items: Pet[] = []

  async findById(id: string): Promise<Pet | null> {
    const pet = this.items.find(item => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async searchMany(
    query: SearchManyParams,
    page: number
  ): Promise<(Pet & { photos: Photo[] })[]> {
    if (!this.organizationsRepository) {
      return []
    }

    const organizationsByCity = this.organizationsRepository.items.filter(
      organization => organization.city === query.city
    )

    const pets = this.items
      .filter(item =>
        organizationsByCity.some(
          organization => organization.id === item.organization_id
        )
      )
      .filter(item => (query.age ? item.age === query.age : true))
      .filter(item => (query.size ? item.size === query.size : true))
      .filter(item =>
        query.energyLevel ? item.energy_level === query.energyLevel : true
      )
      .filter(item =>
        query.environment ? item.environment === query.environment : true
      )

    const petsWithPhotos = pets.map(pet => {
      const photos =
        this.photosRepository?.items.filter(photo => photo.pet_id === pet.id) ||
        []

      return {
        ...pet,
        photos,
      }
    })

    return petsWithPhotos.slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      environment: data.environment,
      organization_id: data.organization_id,
      created_at: new Date(),
      adoption_at: data.adoption_at ? new Date(data.adoption_at) : null,
    }

    this.items.push(pet)

    return pet
  }
}
