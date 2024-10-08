import z from 'zod'

import { makeSearchPetUseCase } from '@/use-cases/factories/make-search-pet-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetQuerySchema = z.object({
    city: z.string(),
    age: z.enum(['Puppy', 'Adult', 'Old']).optional(),
    size: z.enum(['Small', 'Medium', 'Large']).optional(),
    energy: z.enum(['Medium', 'Low', 'High']).optional(),
    environment: z.enum(['Small', 'Medium', 'Large']).optional(),
    page: z.coerce.number().min(1).default(1),
  })

  const { city, age, size, energy, environment, page } =
    searchPetQuerySchema.parse(request.query)

  const searchPetUseCase = makeSearchPetUseCase()

  const { pets } = await searchPetUseCase.execute({
    city,
    age,
    size,
    energy,
    environment,
    page,
  })

  return reply.status(200).send({
    pets,
  })
}
