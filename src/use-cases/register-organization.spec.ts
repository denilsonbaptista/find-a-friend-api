import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists-error'
import { RegisterOrganizationUseCase } from './register-organization'

let organizationRepository: InMemoryOrganizationsRepository
let sut: RegisterOrganizationUseCase

describe('Register Organization Use Case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationsRepository()
    sut = new RegisterOrganizationUseCase(organizationRepository)
  })

  it('should be able to register organization', async () => {
    const { organization } = await sut.execute({
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

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should be able to perform password hash', async () => {
    const { organization } = await sut.execute({
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

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      organization.password
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with the same email', async () => {
    await sut.execute({
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
    ).rejects.toBeInstanceOf(OrganizationAlreadyExistsError)
  })
})
