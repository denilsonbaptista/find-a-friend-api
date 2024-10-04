import type { Photo, Prisma } from '@prisma/client'
import type { PhotosRepository } from '../photos-repository'

import { prisma } from '@/lib/prisma'

export class PrismaPhotosRepository implements PhotosRepository {
  async findById(id: string): Promise<Photo[]> {
    const photos = await prisma.photo.findMany({
      where: {
        id,
      },
    })

    return photos
  }

  async createUrl(data: Prisma.PhotoUncheckedCreateInput): Promise<Photo> {
    const photo = await prisma.photo.create({
      data,
    })

    return photo
  }
}
