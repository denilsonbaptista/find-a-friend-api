import { prisma } from '@/lib/prisma'
import type { Prisma, RequirementsForAdoption } from '@prisma/client'
import type { RequirementsForAdoptionRepository } from '../requirements-for-adoption-repository'

export class PrismaRequirementsForAdoptionRepository
  implements RequirementsForAdoptionRepository
{
  async findById(id: string): Promise<RequirementsForAdoption[]> {
    const requirements = await prisma.requirementsForAdoption.findMany({
      where: {
        id,
      },
    })

    return requirements
  }

  async create(
    data: Prisma.RequirementsForAdoptionUncheckedCreateInput
  ): Promise<RequirementsForAdoption> {
    const requirements = await prisma.requirementsForAdoption.create({
      data,
    })

    return requirements
  }
}
