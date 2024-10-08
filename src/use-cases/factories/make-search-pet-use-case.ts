import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetsUseCase } from '../search-pets'

export function makeSearchPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const searchPetUseCase = new SearchPetsUseCase(petsRepository)

  return searchPetUseCase
}
