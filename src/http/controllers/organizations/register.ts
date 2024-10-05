import z from 'zod'

import type { FastifyReply, FastifyRequest } from 'fastify'

import { OrganizationAlreadyExistsError } from '@/use-cases/errors/organization-already-exists-error'
import { makeRegisterOrganizationUseCase } from '@/use-cases/factories/make-register-organization-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    cep: z.string(),
    city: z.string(),
    state: z.string(),
    address: z.string(),
    complement: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    whatsapp: z.string(),
  })

  const {
    name,
    email,
    password,
    cep,
    city,
    state,
    address,
    complement,
    latitude,
    longitude,
    whatsapp,
  } = registerBodySchema.parse(request.body)

  try {
    const registerOrganizationUseCase = makeRegisterOrganizationUseCase()

    await registerOrganizationUseCase.execute({
      name,
      email,
      password,
      cep,
      city,
      state,
      address,
      complement,
      latitude,
      longitude,
      whatsapp,
    })
  } catch (err) {
    if (err instanceof OrganizationAlreadyExistsError)
      return reply.status(409).send({ message: err.message })

    throw err
  }

  return reply.status(201).send()
}
