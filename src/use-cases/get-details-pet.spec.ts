import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { PetNotFoundError } from './errors/pet-not-found-error'
import { GetDetailsPet } from './get-details-pet'

let petsRepository: InMemoryPetsRepository
let photosRepository: InMemoryPhotosRepository
let sut: GetDetailsPet

describe('View details of a pet for adoption', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    photosRepository = new InMemoryPhotosRepository()
    sut = new GetDetailsPet(petsRepository, photosRepository)
  })

  it('should be able to view details of a pet', async () => {
    const pet = await petsRepository.create({
      name: 'Nina',
      about: 'Nina is a very cute little dog',
      age: '5',
      size: 'Small' as const,
      energy_level: 'High' as const,
      environment: 'Apartment',
      organization_id: 'Organization-01',
    })

    for (let i = 0; i < 5; i++) {
      await photosRepository.createUrl({
        url: 'nina-photo.jpg',
        pet_id: pet.id,
      })
    }

    const petDetails = await sut.execute({ petId: pet.id })

    expect(petDetails).toEqual(
      expect.objectContaining({
        pet: expect.objectContaining({
          name: 'Nina',
        }),
        photos: expect.arrayContaining([
          expect.objectContaining({
            url: 'nina-photo.jpg',
          }),
        ]),
      })
    )

    expect(petDetails.photos).toHaveLength(5)
  })

  it('should be able to get animal not found error', async () => {
    await expect(sut.execute({ petId: 'pet-one' })).rejects.toBeInstanceOf(
      PetNotFoundError
    )
  })
})
