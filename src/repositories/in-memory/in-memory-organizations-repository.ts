import { randomUUID } from 'node:crypto'

import { type Organization, Prisma } from '@prisma/client'
import type { OrganizationsRepository } from '../organizations-repository'

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  public items: Organization[] = []

  async findByEmail(email: string): Promise<Organization | null> {
    const organization = this.items.find(item => item.email === email)

    if (!organization) {
      return null
    }

    return organization
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      cep: data.cep,
      city: data.city,
      state: data.state,
      address: data.address,
      complement: data.complement ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      whatsapp: data.whatsapp,
      created_at: new Date(),
    }

    this.items.push(organization)

    return organization
  }
}
