import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { GetOrganizationUseCase } from './get-organization'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: GetOrganizationUseCase

describe('Get Organization', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new GetOrganizationUseCase(organizationsRepository)
  })

  it('should be able to get organization', async () => {
    const organization = await organizationsRepository.create({
      name: 'Organization XYZ',
      email: 'contact@xyz.com',
      password: '123456',
      cep: '12345-678',
      city: 'São Paulo',
      state: 'SP',
      address: 'Av. Paulista, 1000',
      complement: 'Sala 100',
      latitude: -23.561684,
      longitude: -46.656139,
      whatsapp: '+5511999999999',
    })

    const getOrganization = await sut.execute({
      organizationId: organization.id,
    })

    expect(getOrganization).toEqual(
      expect.objectContaining({
        organization: expect.objectContaining({
          name: 'Organization XYZ',
          email: 'contact@xyz.com',
        }),
      })
    )
  })

  it('should be able to get animal not found error', async () => {
    await expect(
      sut.execute({ organizationId: 'get-organization' })
    ).rejects.toBeInstanceOf(OrganizationNotFoundError)
  })
})
