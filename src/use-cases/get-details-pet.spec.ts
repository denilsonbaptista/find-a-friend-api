import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository'
import { InMemoryRequirementsForAdoptionRepository } from '@/repositories/in-memory/in-memory-requirements-for-adoption-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { PetNotFoundError } from './errors/pet-not-found-error'
import { GetDetailsPet } from './get-details-pet'

let petsRepository: InMemoryPetsRepository
let photosRepository: InMemoryPhotosRepository
let organizationRepository: InMemoryOrganizationsRepository
let requirementsForAdoptionRepository: InMemoryRequirementsForAdoptionRepository
let sut: GetDetailsPet

describe('View details of a pet for adoption', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    photosRepository = new InMemoryPhotosRepository()
    organizationRepository = new InMemoryOrganizationsRepository()
    requirementsForAdoptionRepository =
      new InMemoryRequirementsForAdoptionRepository()
    sut = new GetDetailsPet(
      petsRepository,
      photosRepository,
      organizationRepository,
      requirementsForAdoptionRepository
    )
  })

  it('should be able to view details of a pet', async () => {
    const organization = await organizationRepository.create({
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

    const pet = await petsRepository.create({
      name: 'Nina',
      about: 'Nina is a very cute little dog',
      age: '5',
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

      await requirementsForAdoptionRepository.create({
        requirement: 'Has a garden',
        pet_id: pet.id,
      })
    }

    const petDetails = await sut.execute({ petId: pet.id })

    console.log(JSON.stringify(petDetails, null, 2))

    expect(petDetails).toEqual(
      expect.objectContaining({
        pet: expect.objectContaining({
          name: 'Nina',
          age: '5',
          size: 'Small',
          energy_level: 'High',
          environment: 'Apartment',
          photos: expect.arrayContaining([
            expect.objectContaining({
              url: 'nina-photo.jpg',
            }),
          ]),
          organization: expect.objectContaining({
            name: 'Organization XYZ',
            address: 'Av. Paulista, 1000',
          }),
          requirements_for_adoption: expect.arrayContaining([
            expect.objectContaining({
              requirement: 'Has a garden',
            }),
          ]),
        }),
      })
    )

    expect(petDetails.pet.photos).toHaveLength(5)
  })

  it('should be able to get animal not found error', async () => {
    await expect(sut.execute({ petId: 'pet-one' })).rejects.toBeInstanceOf(
      PetNotFoundError
    )
  })

  it('should be able to get organization not found error', async () => {
    const pet = await petsRepository.create({
      name: 'Nina',
      about: 'Nina is a very cute little dog',
      age: '5',
      size: 'Small' as const,
      energy_level: 'High' as const,
      environment: 'Apartment',
      organization_id: 'Organization-01',
    })

    await expect(sut.execute({ petId: pet.id })).rejects.toBeInstanceOf(
      OrganizationNotFoundError
    )
  })
})
