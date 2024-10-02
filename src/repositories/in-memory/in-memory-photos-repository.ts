import { randomUUID } from 'node:crypto'

import type { Photo, Prisma } from '@prisma/client'
import type { PhotosRepository } from '../photos-repository'

export class InMemoryPhotosRepository implements PhotosRepository {
  public items: Photo[] = []

  async findById(id: string): Promise<Photo[]> {
    return this.items.filter(item => item.pet_id.includes(id))
  }

  async createUrl(data: Prisma.PhotoUncheckedCreateInput): Promise<Photo> {
    const photo = {
      id: randomUUID(),
      url: data.url,
      pet_id: data.pet_id,
    }

    this.items.push(photo)

    return photo
  }
}
