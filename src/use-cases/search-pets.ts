import type { PetsRepository } from '@/repositories/pets-repository'
import type { Pet, Photo } from '@prisma/client'

import { RequiredFieldError } from './errors/required-field-error'

interface SearchPetsUseCaseRequest {
  city: string
  age?: string
  size?: 'Small' | 'Medium' | 'Large'
  energyLevel?: 'Low' | 'High' | 'Medium'
  environment?: string
  page: number
}

interface SearchPetsUseCaseResponse {
  pets: (Pet & { photo: Photo[] })[]
}

export class SearchPets {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    age,
    size,
    energyLevel,
    environment,
    page,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    if (!city) throw new RequiredFieldError('city')

    const pets = await this.petsRepository.searchMany(
      {
        city,
        age,
        size,
        energyLevel,
        environment,
      },
      page
    )

    return {
      pets,
    }
  }
}
