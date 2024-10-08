import { prisma } from '@/lib/prisma'

import type { Prisma, RequirementsForAdoption } from '@prisma/client'
import type { RequirementsForAdoptionRepository } from '../requirements-for-adoption-repository'

export class PrismaRequirementsForAdoptionRepository
  implements RequirementsForAdoptionRepository
{
  async findByPetId(petId: string): Promise<RequirementsForAdoption[]> {
    const requirements = await prisma.requirementsForAdoption.findMany({
      where: {
        pet_id: petId,
      },
    })

    return requirements
  }

  async create(
    data: Prisma.RequirementsForAdoptionUncheckedCreateInput[]
  ): Promise<RequirementsForAdoption[]> {
    await prisma.requirementsForAdoption.createMany({
      data,
    })

    const requirements = await prisma.requirementsForAdoption.findMany({
      where: {
        pet_id: data[0].pet_id,
      },
    })

    return requirements
  }
}
