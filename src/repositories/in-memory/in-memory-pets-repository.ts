import { randomUUID } from 'node:crypto'

import type { Pet, Prisma } from '@prisma/client'
import type { PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

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
