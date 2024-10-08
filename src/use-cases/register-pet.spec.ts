import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { RegisterPetUseCase } from './register-pet'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: RegisterPetUseCase

describe('Register Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()

    sut = new RegisterPetUseCase(petsRepository, organizationsRepository)
  })

  it('should be able to register a pet', async () => {
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

    const { pet } = await sut.execute({
      name: 'Nina',
      about: 'Nina is a very cute little dog',
      age: 'Puppy',
      size: 'Small',
      energy: 'High',
      environment: 'Small',
      organizationId: organization.id,
    })

    expect(pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Nina',
        age: 'Puppy',
        size: 'Small',
        energy_level: 'High',
        environment: 'Small',
      })
    )
  })

  it('should throw an error if organization does not exist', async () => {
    await expect(
      sut.execute({
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
        size: 'Small',
        energy: 'High',
        environment: 'Small',
        organizationId: 'non-existing-organization-id',
      })
    ).rejects.toBeInstanceOf(OrganizationNotFoundError)
  })
})
