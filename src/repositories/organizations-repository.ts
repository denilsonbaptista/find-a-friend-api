import type { Organization, Prisma } from '@prisma/client'

export type FindManyNearbyParams = {
  latitude: number
  longitude: number
}

export type OrganizationsRepository = {
  findById(id: string): Promise<Organization | null>
  findByEmail(email: string): Promise<Organization | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Organization[]>
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>
}
