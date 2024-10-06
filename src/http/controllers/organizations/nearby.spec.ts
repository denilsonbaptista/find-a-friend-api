import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Organization (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby organization', async () => {
    await request(app.server).post('/organizations').send({
      name: 'Organization Cat XYZ',
      email: 'contactcat@xyz.com',
      password: '123456',
      cep: '12345-678',
      city: 'São Paulo',
      state: 'SP',
      address: 'Av. Paulista, 1000',
      complement: 'Sala 100',
      latitude: -6.099516,
      longitude: -49.852861,
      whatsapp: '+5511999999999',
    })

    await request(app.server).post('/organizations').send({
      name: 'Organization Dog XYZ',
      email: 'contactdog@xyz.com',
      password: '123456',
      cep: '12345-678',
      city: 'São Paulo',
      state: 'SP',
      address: 'Av. Paulista, 1000',
      complement: 'Sala 100',
      latitude: -5.371733,
      longitude: -49.123338,
      whatsapp: '+5511999999999',
    })

    const response = await request(app.server)
      .get('/organizations/nearby')
      .query({
        latitude: -6.099516,
        longitude: -49.852861,
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.organizations).toHaveLength(1)
    expect(response.body.organizations).toEqual([
      expect.objectContaining({
        name: 'Organization Cat XYZ',
      }),
    ])
  })
})
