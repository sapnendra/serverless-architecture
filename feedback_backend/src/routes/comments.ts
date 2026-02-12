import { Hono } from 'hono'
import { createComment, getCommentThread } from '../services/comment.service'
import { Env } from '../types/env'

const comments = new Hono<{ Bindings: Env }>()

// Get all comments for a feedback (threaded)
comments.get('/:feedbackId', async c => {
  const feedbackId = c.req.param('feedbackId')
  const data = await getCommentThread(c.env, feedbackId)
  return c.json({ success: true, data })
})

// Create a new comment
comments.post('/', async c => {
  const body = await c.req.json<{
    feedbackId: string
    authorName: string
    content: string
    parentCommentId?: string
  }>()

  const result = await createComment(c.env, body)
  return c.json({ success: true, data: result })
})

export default comments
