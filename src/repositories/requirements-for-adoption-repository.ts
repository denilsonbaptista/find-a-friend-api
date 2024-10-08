import type { Prisma, RequirementsForAdoption } from '@prisma/client'

export type RequirementsForAdoptionRepository = {
  findByPetId(petId: string): Promise<RequirementsForAdoption[]>
  create(
    data: Prisma.RequirementsForAdoptionCreateManyInput[]
  ): Promise<RequirementsForAdoption[]>
}
