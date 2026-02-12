import { MiddlewareHandler } from 'hono'
import { Env } from '../types/env'

export const adminAuth: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const apiKey = c.req.header('x-api-key')

  if (!apiKey || apiKey !== c.env.ADMIN_API_KEY) {
    return c.json(
      { success: false, message: 'Unauthorized' },
      401
    )
  }

  await next()
}
