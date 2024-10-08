import { randomUUID } from 'node:crypto'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { PetNotFoundError } from './errors/pet-not-found-error'
import { GetPetUseCase } from './get-pet'

let petsRepository: InMemoryPetsRepository
let sut: GetPetUseCase

describe('View details of a pet for adoption', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to view details of a pet', async () => {
    const pet = await petsRepository.create({
      name: 'Nina',
      about: 'Nina is a very cute little dog',
      age: 'Puppy',
      size: 'Small',
      energy_level: 'High',
      environment: 'Small',
      organization_id: randomUUID(),
    })

    const getPet = await sut.execute({ petId: pet.id })

    expect(getPet).toEqual(
      expect.objectContaining({
        pet: expect.objectContaining({
          name: 'Nina',
          age: 'Puppy',
          size: 'Small',
          energy_level: 'High',
          environment: 'Small',
        }),
      })
    )
  })

  it('should be able to get animal not found error', async () => {
    await expect(sut.execute({ petId: 'pet-one' })).rejects.toBeInstanceOf(
      PetNotFoundError
    )
  })
})
