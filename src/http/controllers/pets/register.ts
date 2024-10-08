import z from 'zod'

import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.enum(['Puppy', 'Adult', 'Old']),
    size: z.enum(['Small', 'Medium', 'Large']),
    energy: z.enum(['Medium', 'Low', 'High']),
    environment: z.enum(['Small', 'Medium', 'Large']),
  })

  const { name, about, age, size, energy, environment } =
    registerBodySchema.parse(request.body)

  const registerPetUseCase = makeRegisterPetUseCase()

  const { pet } = await registerPetUseCase.execute({
    name,
    about,
    age,
    size,
    energy,
    environment,
    organizationId: request.user.sub,
  })

  return reply.status(201).send({
    pet,
  })
}
