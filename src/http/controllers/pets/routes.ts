import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { pet } from './pet'
import { register } from './register'
import { requirementsForAdoption } from './requirements-for-adoption'
import { search } from './search'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/register/pets', { onRequest: [verifyJwt] }, register)
  app.post(
    '/register/pets/:petId/requirements-for-adoption',
    { onRequest: [verifyJwt] },
    requirementsForAdoption
  )

  app.get('/pet/:petId', pet)
  app.get('/pet/search', search)
}
