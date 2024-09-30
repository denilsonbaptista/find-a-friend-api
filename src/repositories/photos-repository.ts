import type { Photo, Prisma } from '@prisma/client'

export type PhotosRepository = {
  createUrl(data: Prisma.PhotoUncheckedCreateInput): Promise<Photo>
}
