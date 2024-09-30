import fs from 'node:fs'

import { DiskStorage } from '@/providers/disk-storage'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NoPhotoProvidedError } from './errors/no-photo-provided-error'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { RegisterPetUseCase } from './register-pet'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let photosRepository: InMemoryPhotosRepository
let diskStorage: DiskStorage
let sut: RegisterPetUseCase

const organizationData = {
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
}

const petData = {
  name: 'Nina',
  about: 'Nina is a very cute little dog',
  age: '5',
  size: 'Small' as const,
  energyLevel: 'High' as const,
  environment: 'Apartment',
  photos: ['nina-photo.jpg'],
}

describe('Register Organization Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    photosRepository = new InMemoryPhotosRepository()

    vi.spyOn(fs.promises, 'rename').mockResolvedValueOnce(undefined)
    vi.spyOn(fs.promises, 'stat').mockResolvedValueOnce({} as fs.Stats)
    vi.spyOn(fs.promises, 'unlink').mockResolvedValueOnce(undefined)

    diskStorage = new DiskStorage()
    vi.spyOn(diskStorage, 'saveFile').mockResolvedValue('saved-photo.jpg')

    sut = new RegisterPetUseCase(
      petsRepository,
      organizationsRepository,
      photosRepository
    )
  })

  it('should be able to register a pet', async () => {
    const { id } = await organizationsRepository.create(organizationData)

    const { pet, photos } = await sut.execute({
      ...petData,
      organizationId: id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(photos).toHaveLength(1)
    expect(photos[0].id).toEqual(expect.any(String))
  })

  it('should throw an error if no photo is provided', async () => {
    const { id } = await organizationsRepository.create(organizationData)

    await expect(
      sut.execute({
        ...petData,
        photos: [''], // no photo
        organizationId: id,
      })
    ).rejects.toBeInstanceOf(NoPhotoProvidedError)
  })

  it('should throw an error if organization does not exist', async () => {
    await expect(
      sut.execute({
        ...petData,
        organizationId: 'non-existing-organization',
      })
    ).rejects.toBeInstanceOf(OrganizationNotFoundError)
  })
})
