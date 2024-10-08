import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { RequiredFieldError } from './errors/required-field-error'
import { SearchPetsUseCase } from './search-pets'

let organizationsRepository: InMemoryOrganizationsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('Search Pets Use Case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    petsRepository = new InMemoryPetsRepository(organizationsRepository)
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should be able to search for pets by their characteristics', async () => {
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

    await petsRepository.create({
      name: 'Nina Adopted',
      about: 'Nina is a very cute little dog',
      age: 'Puppy',
      size: 'Small',
      energy_level: 'High',
      environment: 'Small',
      organization_id: organization.id,
      adoption_at: new Date('2023-01-01'),
    })

    for (let i = 0; i < 3; i++) {
      await petsRepository.create({
        name: `Nina 0${i}`,
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
        size: 'Small',
        energy_level: 'High',
        environment: 'Small',
        organization_id: organization.id,
      })
    }

    const searchByFull = await sut.execute({
      city: 'São Paulo',
      age: 'Puppy',
      size: 'Small',
      energy: 'High',
      environment: 'Small',
      page: 1,
    })

    expect(searchByFull.pets).not.toEqual(
      expect.objectContaining({
        name: 'Nina Adopted',
      })
    )

    expect(searchByFull.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        age: 'Puppy',
      })
    )

    const searchByCity = await sut.execute({
      city: 'São Paulo',
      page: 1,
    })

    expect(searchByCity.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        age: 'Puppy',
      })
    )

    const searchByAge = await sut.execute({
      city: 'São Paulo',
      age: 'Puppy',
      page: 1,
    })

    expect(searchByAge.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        age: 'Puppy',
      })
    )

    const searchBySize = await sut.execute({
      city: 'São Paulo',
      size: 'Small',
      page: 1,
    })

    expect(searchBySize.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        size: 'Small',
      })
    )

    const searchByEnergyLevel = await sut.execute({
      city: 'São Paulo',
      energy: 'High',
      page: 1,
    })

    expect(searchByEnergyLevel.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        energy_level: 'High',
      })
    )

    const searchByEnvironment = await sut.execute({
      city: 'São Paulo',
      environment: 'Small',
      page: 1,
    })

    expect(searchByEnvironment.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        environment: 'Small',
      })
    )
  })

  it('should be able to search for pets by their characteristics and return the next page', async () => {
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

    for (let i = 0; i < 25; i++) {
      await petsRepository.create({
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
        size: 'Small',
        energy_level: 'High',
        environment: 'Small',
        organization_id: organization.id,
      })
    }

    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 2,
    })

    expect(pets).toHaveLength(5)
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina',
        age: 'Puppy',
      })
    )
  })

  it('should not be able to search for pets by their characteristics if city is not provided', async () =>
    await expect(() =>
      sut.execute({
        city: '',
        page: 1,
      })
    ).rejects.toBeInstanceOf(RequiredFieldError))
})
