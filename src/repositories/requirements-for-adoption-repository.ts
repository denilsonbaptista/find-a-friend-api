import type { Prisma, RequirementsForAdoption } from '@prisma/client'

export type RequirementsForAdoptionRepository = {
  findById(id: string): Promise<RequirementsForAdoption[]>
  create(
    data: Prisma.RequirementsForAdoptionUncheckedCreateInput
  ): Promise<RequirementsForAdoption>
}
