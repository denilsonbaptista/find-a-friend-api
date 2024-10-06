import z from 'zod'

import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchNearbyOrganizationsUseCase } from '@/use-cases/factories/make-fetch-nearby-organization-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyQuerySchema = z.object({
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyQuerySchema.parse(request.query)

  const fetchNearbyOrganizationsUseCase = makeFetchNearbyOrganizationsUseCase()

  const { organizations } = await fetchNearbyOrganizationsUseCase.execute({
    latitude,
    longitude,
  })

  return reply.status(200).send({
    organizations,
  })
}
