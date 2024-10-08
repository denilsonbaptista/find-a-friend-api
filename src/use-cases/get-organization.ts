import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { Organization } from '@prisma/client'

import { OrganizationNotFoundError } from './errors/organization-not-found-error'

interface GetOrganizationUseCaseRequest {
  organizationId: string
}

interface GetOrganizationUseCaseResponse {
  organization: Organization
}

export class GetOrganizationUseCase {
  constructor(private organizationRepository: OrganizationsRepository) {}

  async execute({
    organizationId,
  }: GetOrganizationUseCaseRequest): Promise<GetOrganizationUseCaseResponse> {
    const organization =
      await this.organizationRepository.findById(organizationId)

    if (!organization) throw new OrganizationNotFoundError()

    return {
      organization,
    }
  }
}
