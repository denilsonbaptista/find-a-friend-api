import { randomUUID } from 'node:crypto'

import type { Prisma, RequirementsForAdoption } from '@prisma/client'
import type { RequirementsForAdoptionRepository } from '../requirements-for-adoption-repository'

export class InMemoryRequirementsForAdoptionRepository
  implements RequirementsForAdoptionRepository
{
  public items: RequirementsForAdoption[] = []

  async findById(id: string): Promise<RequirementsForAdoption[]> {
    return this.items.filter(item => item.pet_id.includes(id))
  }

  async create(
    data: Prisma.RequirementsForAdoptionUncheckedCreateInput
  ): Promise<RequirementsForAdoption> {
    const requirement = {
      id: randomUUID(),
      requirement: data.requirement,
      pet_id: data.pet_id,
    }

    this.items.push(requirement)

    return requirement
  }
}
