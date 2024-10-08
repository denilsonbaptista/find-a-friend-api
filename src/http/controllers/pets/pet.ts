import z from 'zod'

import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetOrganizationUseCase } from '@/use-cases/factories/make-get-organization-use-case'
import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case'
import { makeGetRequirementsForAdoptionUseCase } from '@/use-cases/factories/make-get-requirements-for-adoption'

export async function pet(request: FastifyRequest, reply: FastifyReply) {
  const petParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = petParamsSchema.parse(request.params)

  const getPetUseCase = makeGetPetUseCase()
  const { pet } = await getPetUseCase.execute({ petId })

  const getOrganizationUseCase = makeGetOrganizationUseCase()
  const { organization } = await getOrganizationUseCase.execute({
    organizationId: pet.organization_id,
  })

  const getRequirementsForAdoptionUseCase =
    makeGetRequirementsForAdoptionUseCase()
  const { requirements } = await getRequirementsForAdoptionUseCase.execute({
    petId,
  })

  return reply.status(200).send({
    pet: {
      ...pet,
      organization_id: undefined,
      organization: {
        ...organization,
        password: undefined,
      },
      requirements_for_adoption: [...requirements],
    },
  })
}
