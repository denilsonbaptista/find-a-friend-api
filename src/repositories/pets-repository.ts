import type { Pet, Photo, Prisma } from '@prisma/client'

export type SearchManyParams = {
  city: string
  age?: string
  size?: 'Small' | 'Medium' | 'Large'
  energyLevel?: 'Low' | 'High' | 'Medium'
  environment?: string
}

export type PetsRepository = {
  searchMany(
    query: SearchManyParams,
    page: number
  ): Promise<(Pet & { photo: Photo[] })[]>
  findById(id: string): Promise<Pet | null>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
