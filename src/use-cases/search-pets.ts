import type { PetsRepository } from '@/repositories/pets-repository'
import type { Pet } from '@prisma/client'

import { RequiredFieldError } from './errors/required-field-error'

interface SearchPetsUseCaseRequest {
  city: string
  age?: 'Puppy' | 'Adult' | 'Old'
  size?: 'Small' | 'Medium' | 'Large'
  energy?: 'Low' | 'High' | 'Medium'
  environment?: 'Small' | 'Medium' | 'Large'
  page: number
}

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    age,
    size,
    energy,
    environment,
    page,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    if (!city) throw new RequiredFieldError('city')

    const pets = await this.petsRepository.searchMany(
      {
        city,
        age,
        size,
        energy,
        environment,
      },
      page
    )

    return {
      pets,
    }
  }
}
