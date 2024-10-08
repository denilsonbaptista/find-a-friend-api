import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pet', async () => {
    await createAndAuthenticateOrganization(app)

    const organization = await prisma.organization.findFirstOrThrow()

    await prisma.pet.create({
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

    const response = await request(app.server)
      .get('/pet/search')
      .query({
        city: 'São Paulo',
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets).toEqual([
      expect.objectContaining({
        name: 'Nina',
        about: 'Nina is a very cute little dog',
        age: 'Puppy',
      }),
    ])
  })
})
