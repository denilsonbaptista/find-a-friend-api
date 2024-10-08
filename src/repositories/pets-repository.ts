import type { Pet, Photo, Prisma } from '@prisma/client'

export type SearchManyParams = {
  city: string
  age?: 'Puppy' | 'Adult' | 'Old'
  size?: 'Small' | 'Medium' | 'Large'
  energy?: 'Low' | 'High' | 'Medium'
  environment?: 'Small' | 'Medium' | 'Large'
}

export type PetsRepository = {
  searchMany(query: SearchManyParams, page: number): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
