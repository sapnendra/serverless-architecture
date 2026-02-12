import { Hono } from 'hono'
import { createFeedback, listApprovedFeedback } from '../services/feedback.service'
import { Env } from '../types/env'

const feedback = new Hono<{ Bindings: Env }>()

feedback.post('/', async c => {
  const body = await c.req.json()
  const result = await createFeedback(c.env, body)
  return c.json({ success: true, data: result })
})

feedback.get('/', async c => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')
  const search = c.req.query('search') || ''

  const data = await listApprovedFeedback(c.env, { page, limit, search })
  return c.json({ success: true, ...data })
})

export default feedback
