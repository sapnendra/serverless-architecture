import { Hono } from 'hono'
import { adminAuth } from '../middlewares/adminAuth'
import {
  listPendingFeedback,
  updateFeedbackStatus
} from '../services/feedback.service'
import { Env } from '../types/env'

const admin = new Hono<{ Bindings: Env }>()

// 🔐 Protect ALL admin routes
admin.use('*', adminAuth)

admin.get('/feedback/pending', async c => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')
  const search = c.req.query('search') || ''

  const data = await listPendingFeedback(c.env, { page, limit, search })
  return c.json({ success: true, ...data })
})

admin.patch('/feedback/:id/approve', async c => {
  const id = c.req.param('id')
  await updateFeedbackStatus(c.env, id, 'approved')
  return c.json({ success: true })
})

admin.patch('/feedback/:id/reject', async c => {
  const id = c.req.param('id')
  await updateFeedbackStatus(c.env, id, 'rejected')
  return c.json({ success: true })
})

export default admin
