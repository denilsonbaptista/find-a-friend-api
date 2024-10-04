import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyOrganizationsUseCase } from './fetch-nearby-organizations'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: FetchNearbyOrganizationsUseCase

describe('Fetch Nearby Organization Use Case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new FetchNearbyOrganizationsUseCase(organizationsRepository)
  })

  it('should be able to fetch nearby organizations', async () => {
    await organizationsRepository.create({
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

    await organizationsRepository.create({
      name: 'Organization ABC',
      email: 'contact@abc.com',
      password: '1234567',
      cep: '12345-678',
      city: 'Sorocaba',
      state: 'SP',
      address: 'Av. Paulista, 1000',
      complement: 'Sala 100',
      latitude: -23.479085,
      longitude: -47.476159,
      whatsapp: '+5511999999999',
    })

    const { organizations } = await sut.execute({
      latitude: -23.561684,
      longitude: -46.656139,
    })

    expect(organizations).toHaveLength(1)
    expect(organizations).toEqual([
      expect.objectContaining({
        name: 'Organization XYZ',
      }),
    ])
  })
})
