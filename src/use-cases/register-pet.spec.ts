import fs from 'node:fs'

import { DiskStorage } from '@/providers/disk-storage'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository'
import { InMemoryRequirementsForAdoptionRepository } from '@/repositories/in-memory/in-memory-requirements-for-adoption-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NoPhotoProvidedError } from './errors/no-photo-provided-error'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { RegisterPetUseCase } from './register-pet'

let petsRepository: InMemoryPetsRepository
let photosRepository: InMemoryPhotosRepository
let organizationsRepository: InMemoryOrganizationsRepository
let requirementsForAdoptionRepository: InMemoryRequirementsForAdoptionRepository
let diskStorage: DiskStorage
let sut: RegisterPetUseCase

describe('Register Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    photosRepository = new InMemoryPhotosRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    requirementsForAdoptionRepository =
      new InMemoryRequirementsForAdoptionRepository()

    vi.spyOn(fs.promises, 'rename').mockResolvedValueOnce(undefined)
    vi.spyOn(fs.promises, 'stat').mockResolvedValueOnce({} as fs.Stats)
    vi.spyOn(fs.promises, 'unlink').mockResolvedValueOnce(undefined)

    diskStorage = new DiskStorage()
    vi.spyOn(diskStorage, 'saveFile').mockResolvedValue('saved-photo.jpg')

    sut = new RegisterPetUseCase(
      petsRepository,
      photosRepository,
      organizationsRepository,
      requirementsForAdoptionRepository
    )
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
      age: '5',
      size: 'Small' as const,
      energyLevel: 'High' as const,
      environment: 'Apartment',
      organizationId: organization.id,
      photos: ['nina-photo.jpg'],
      requirementsForAdoption: ['Has a garden', 'Loves to play'],
    })

    expect(pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
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
        requirements_for_adoption: expect.arrayContaining([
          expect.objectContaining({
            requirement: 'Has a garden',
          }),
        ]),
      })
    )
  })

  it('should throw an error if no photo is provided', async () => {
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

    await expect(
      sut.execute({
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: '5',
        size: 'Small' as const,
        energyLevel: 'High' as const,
        environment: 'Apartment',
        organizationId: organization.id,
        photos: [''],
        requirementsForAdoption: ['Has a garden', 'Loves to play'],
      })
    ).rejects.toBeInstanceOf(NoPhotoProvidedError)
  })

  it.skip('should throw an error if organization does not exist', async () => {
    await expect(
      sut.execute({
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: '5',
        size: 'Small' as const,
        energyLevel: 'High' as const,
        environment: 'Apartment',
        organizationId: 'non-existing-organization-id',
        photos: ['nina-photo.jpg'],
        requirementsForAdoption: ['Has a garden', 'Loves to play'],
      })
    ).rejects.toBeInstanceOf(OrganizationNotFoundError)
  })
})
