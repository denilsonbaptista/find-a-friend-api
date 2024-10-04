import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository'
import { RequiredFieldError } from './errors/required-field-error'
import { SearchPets } from './search-pets'

let organizationsRepository: InMemoryOrganizationsRepository
let photosRepository: InMemoryPhotosRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPets

describe('Search Pets Use Case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    photosRepository = new InMemoryPhotosRepository()
    petsRepository = new InMemoryPetsRepository(
      organizationsRepository,
      photosRepository
    )
    sut = new SearchPets(petsRepository)
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
      size: 'Small' as const,
      energy_level: 'High' as const,
      environment: 'Apartment',
      organization_id: organization.id,
      adoption_at: new Date('2023-01-01'),
    })

    for (let i = 0; i < 3; i++) {
      const pet = await petsRepository.create({
        name: `Nina 0${i}`,
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
        size: 'Small' as const,
        energy_level: 'High' as const,
        environment: 'Apartment',
        organization_id: organization.id,
      })

      for (let i = 0; i < 5; i++) {
        await photosRepository.createUrl({
          url: 'nina-photo.jpg',
          pet_id: pet.id,
        })
      }
    }

    const searchByFull = await sut.execute({
      city: 'São Paulo',
      age: 'Puppy',
      size: 'Small',
      energyLevel: 'High',
      environment: 'Apartment',
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
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
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
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
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
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
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
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
      })
    )

    const searchByEnergyLevel = await sut.execute({
      city: 'São Paulo',
      energyLevel: 'High',
      page: 1,
    })

    expect(searchByEnergyLevel.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        energy_level: 'High',
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
      })
    )

    const searchByEnvironment = await sut.execute({
      city: 'São Paulo',
      environment: 'Apartment',
      page: 1,
    })

    expect(searchByEnvironment.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Nina 00',
        environment: 'Apartment',
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
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
      const pet = await petsRepository.create({
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
        size: 'Small' as const,
        energy_level: 'High' as const,
        environment: 'Apartment',
        organization_id: organization.id,
      })

      await photosRepository.createUrl({
        url: 'nina-photo.jpg',
        pet_id: pet.id,
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
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
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
