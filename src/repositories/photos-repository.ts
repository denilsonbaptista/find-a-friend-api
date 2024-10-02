import type { Photo, Prisma } from '@prisma/client'

export type PhotosRepository = {
  findById(id: string): Promise<Photo[]>
  createUrl(data: Prisma.PhotoUncheckedCreateInput): Promise<Photo>
}
