import type { Organization, Prisma } from '@prisma/client'

export type OrganizationsRepository = {
  findById(id: string): Promise<Organization | null>
  findByEmail(email: string): Promise<Organization | null>
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>
}
