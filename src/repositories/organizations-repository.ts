import type { Organization, Prisma } from '@prisma/client'

export type OrganizationsRepository = {
  findByEmail(email: string): Promise<Organization | null>
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>
}
