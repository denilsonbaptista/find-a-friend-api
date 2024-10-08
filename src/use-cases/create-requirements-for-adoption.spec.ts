import { randomUUID } from 'node:crypto'
import { InMemoryRequirementsForAdoptionRepository } from '@/repositories/in-memory/in-memory-requirements-for-adoption-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateRequirementsForAdoptionUseCase } from './create-requirements-for-adoption'

let requirementsForAdoptionRepository: InMemoryRequirementsForAdoptionRepository
let sut: CreateRequirementsForAdoptionUseCase

describe('Create Requirements For Adoption Use Case', () => {
  beforeEach(() => {
    requirementsForAdoptionRepository =
      new InMemoryRequirementsForAdoptionRepository()
    sut = new CreateRequirementsForAdoptionUseCase(
      requirementsForAdoptionRepository
    )
  })

  it('should be able to create requirements for adoption', async () => {
    const petId = randomUUID()

    const { requirements } = await sut.execute({
      requirements: ['First requirement', 'Second requirement'],
      petId,
    })

    expect(requirements).toHaveLength(2)
    expect(requirements).toEqual([
      expect.objectContaining({
        requirement: 'First requirement',
        pet_id: petId,
      }),
      expect.objectContaining({
        requirement: 'Second requirement',
        pet_id: petId,
      }),
    ])
  })
})
