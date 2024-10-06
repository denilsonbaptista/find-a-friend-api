import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { FetchNearbyOrganizationsUseCase } from '../fetch-nearby-organizations'

export function makeFetchNearbyOrganizationsUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()
  const fetchNearbyOrganizationsUseCase = new FetchNearbyOrganizationsUseCase(
    organizationsRepository
  )

  return fetchNearbyOrganizationsUseCase
}
