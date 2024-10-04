import type { Pet, Photo, Prisma } from '@prisma/client'
import type { PetsRepository, SearchManyParams } from '../pets-repository'

import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async searchMany(
    { city, age, size, energyLevel, environment }: SearchManyParams,
    page: number
  ): Promise<(Pet & { photo: Photo[] })[]> {
    const pets = await prisma.pet.findMany({
      where: {
        organization: {
          city,
        },
        age,
        size,
        energy_level: energyLevel,
        environment,
        adoption_at: null,
      },
      include: {
        photo: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
