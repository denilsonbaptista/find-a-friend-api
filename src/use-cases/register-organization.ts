import { hash } from 'bcryptjs'

import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { Organization } from '@prisma/client'

import { OrganizationAlreadyExistsError } from './errors/organization-already-exists-error'

interface RegisterOrganizationUseCaseRequest {
  name: string
  email: string
  password: string
  cep: string
  city: string
  state: string
  address: string
  complement: string | null
  latitude: number
  longitude: number
  whatsapp: string
}

interface RegisterOrganizationUseCaseResponse {
  organization: Organization
}

export class RegisterOrganizationUseCase {
  constructor(private organizationRepository: OrganizationsRepository) {}

  async execute({
    name,
    email,
    password,
    cep,
    city,
    state,
    address,
    complement,
    latitude,
    longitude,
    whatsapp,
  }: RegisterOrganizationUseCaseRequest): Promise<RegisterOrganizationUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail =
      await this.organizationRepository.findByEmail(email)

    if (userWithSameEmail) throw new OrganizationAlreadyExistsError()

    const organization = await this.organizationRepository.create({
      name,
      email,
      password: password_hash,
      cep,
      city,
      state,
      address,
      complement,
      latitude,
      longitude,
      whatsapp,
    })

    return {
      organization,
    }
  }
}
