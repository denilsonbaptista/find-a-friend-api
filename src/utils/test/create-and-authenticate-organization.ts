import request from 'supertest'

import type { FastifyInstance } from 'fastify'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
  await prisma.organization.create({
    data: {
      name: 'Organization XYZ',
      email: 'contact@xyz.com',
      password: await hash('123456', 6),
      cep: '12345-678',
      city: 'São Paulo',
      state: 'SP',
      address: 'Av. Paulista, 1000',
      complement: 'Sala 100',
      latitude: -23.561684,
      longitude: -46.656139,
      whatsapp: '+5511999999999',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'contact@xyz.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
