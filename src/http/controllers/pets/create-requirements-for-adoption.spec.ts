import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create requirements for adoption (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create requirements for adoption', async () => {
    const { token } = await createAndAuthenticateOrganization(app)

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

    const response = await request(app.server)
      .post(`/register/pets/${pet.id}/requirements-for-adoption`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        requirements: ['She is a very good girl', 'She is a very good girl'],
      })

    expect(response.statusCode).toEqual(201)
  })
})
