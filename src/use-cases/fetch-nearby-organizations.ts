import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { Organization } from '@prisma/client'

interface FetchNearbyOrganizationsUseCaseRequest {
  latitude: number
  longitude: number
}

interface FetchNearbyOrganizationsUseCaseResponse {
  organizations: Organization[]
}

export class FetchNearbyOrganizationsUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchNearbyOrganizationsUseCaseRequest): Promise<FetchNearbyOrganizationsUseCaseResponse> {
    const organizations = await this.organizationsRepository.findManyNearby({
      latitude,
      longitude,
    })

    return {
      organizations,
    }
  }
}
