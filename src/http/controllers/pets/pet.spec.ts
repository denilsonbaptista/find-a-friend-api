import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a pet', async () => {
    await createAndAuthenticateOrganization(app)

    const organization = await prisma.organization.findFirstOrThrow()

    const pet = await prisma.pet.create({
      data: {
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
        size: 'Small',
        energy_level: 'High',
        environment: 'Small',
        organization_id: organization.id,
      },
    })

    await prisma.requirementsForAdoption.createMany({
      data: [
        {
          requirement: 'Be friendly with other dogs',
          pet_id: pet.id,
        },
        {
          requirement: 'Be friendly with children',
          pet_id: pet.id,
        },
      ],
    })

    const response = await request(app.server).get(`/pet/${pet.id}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
        organization: expect.objectContaining({
          id: expect.any(String),
          name: 'Organization XYZ',
          email: 'contact@xyz.com',
          cep: '12345-678',
          city: 'São Paulo',
        }),
      })
    )
  })
})
