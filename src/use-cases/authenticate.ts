import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { Organization } from '@prisma/client'

import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  organization: Organization
}

export class AuthenticateUseCase {
  constructor(private organizationRepository: OrganizationsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.organizationRepository.findByEmail(email)

    if (!organization) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, organization.password)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return {
      organization,
    }
  }
}
