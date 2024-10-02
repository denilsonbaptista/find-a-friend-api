import type { Pet, Prisma } from '@prisma/client'

export type PetsRepository = {
  findById(id: string): Promise<Pet | null>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
