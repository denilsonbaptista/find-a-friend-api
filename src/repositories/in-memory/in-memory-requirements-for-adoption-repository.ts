import { randomUUID } from 'node:crypto'

import type { Prisma, RequirementsForAdoption } from '@prisma/client'
import type { RequirementsForAdoptionRepository } from '../requirements-for-adoption-repository'

export class InMemoryRequirementsForAdoptionRepository
  implements RequirementsForAdoptionRepository
{
  public items: RequirementsForAdoption[] = []

  async findByPetId(petId: string): Promise<RequirementsForAdoption[]> {
    return this.items.filter(item => item.pet_id.includes(petId))
  }

  async create(
    data: Prisma.RequirementsForAdoptionCreateManyInput[]
  ): Promise<RequirementsForAdoption[]> {
    const requirements = data.map(requirement => {
      const requirementsForAdoption = {
        id: randomUUID(),
        requirement: requirement.requirement,
        pet_id: requirement.pet_id,
      }

      this.items.push(requirementsForAdoption)

      return requirementsForAdoption
    })

    return requirements
  }
}
