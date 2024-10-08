import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { createRequirementsForAdoption } from './create-requirements-for-adoption'
import { pet } from './pet'
import { register } from './register'
import { search } from './search'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/register/pets', { onRequest: [verifyJwt] }, register)
  app.post(
    '/register/pets/:petId/requirements-for-adoption',
    { onRequest: [verifyJwt] },
    createRequirementsForAdoption
  )

  app.get('/pet/:petId', pet)
  app.get('/pet/search', search)
}
