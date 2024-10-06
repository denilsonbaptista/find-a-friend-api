import type { FastifyInstance } from 'fastify'

import { authenticate } from './authenticate'
import { nearby } from './nearby'
import { refresh } from './refresh'
import { register } from './register'

export async function organizationRoutes(app: FastifyInstance) {
  app.post('/organizations', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/organizations/nearby', nearby)
}
