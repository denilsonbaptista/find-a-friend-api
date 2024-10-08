import { randomUUID } from 'node:crypto'
import { InMemoryRequirementsForAdoptionRepository } from '@/repositories/in-memory/in-memory-requirements-for-adoption-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetRequirementsForAdoptionUseCase } from './get-requirements-for-adoption'

let requirementsForAdoptionRepository: InMemoryRequirementsForAdoptionRepository
let sut: GetRequirementsForAdoptionUseCase

describe('Get Requirements For Adoption Use Case', () => {
  beforeEach(() => {
    requirementsForAdoptionRepository =
      new InMemoryRequirementsForAdoptionRepository()
    sut = new GetRequirementsForAdoptionUseCase(
      requirementsForAdoptionRepository
    )
  })

  it('should be able to create requirements for adoption', async () => {
    const petId = randomUUID()

    const requirementsForAdoption = [
      {
        requirement: 'First requirement',
        pet_id: petId,
      },
      {
        requirement: 'Second requirement',
        pet_id: petId,
      },
    ]

    await requirementsForAdoptionRepository.create(requirementsForAdoption)

    const { requirements } = await sut.execute({
      petId,
    })

    expect(requirements).toHaveLength(2)
    expect(requirements).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        requirement: 'First requirement',
        pet_id: petId,
      }),
      expect.objectContaining({
        id: expect.any(String),
        requirement: 'Second requirement',
        pet_id: petId,
      }),
    ])
  })
})
