import type { FastifyInstance } from 'fastify'

import { register } from './register'

export async function organizationRoutes(app: FastifyInstance) {
  app.post('/organizations', register)
}
