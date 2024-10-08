import z from 'zod'

import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeCreateRequirementsForAdoptionUseCase } from '@/use-cases/factories/make-create-requirements-for-adoption-use-case'

export async function requirementsForAdoption(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requirementsForAdoptionParamsSchema = z.object({
    petId: z.string(),
  })

  const requirementsForAdoptionBodySchema = z.object({
    requirements: z.array(z.string()),
  })

  const { petId } = requirementsForAdoptionParamsSchema.parse(request.params)
  const { requirements } = requirementsForAdoptionBodySchema.parse(request.body)

  const createRequirementsForAdoptionUseCase =
    makeCreateRequirementsForAdoptionUseCase()

  await createRequirementsForAdoptionUseCase.execute({
    requirements,
    petId,
  })

  return reply.status(201).send({})
}
