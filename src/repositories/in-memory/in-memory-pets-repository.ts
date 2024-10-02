import { randomUUID } from 'node:crypto'

import type { Pet, Prisma } from '@prisma/client'
import type { PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string): Promise<Pet | null> {
    const pet = this.items.find(item => item.id === id)

    if (!pet) {
      return null
    }

    return pet
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
