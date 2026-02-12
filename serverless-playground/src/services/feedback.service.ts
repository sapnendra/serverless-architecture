import { Env } from '../types/env'

export async function createFeedback(env: Env, data: {
  name: string
  message: string
}) {
  const id = crypto.randomUUID()

  await env.feedback_db
    .prepare(
      `INSERT INTO feedback (id, name, message, status)
       VALUES (?, ?, ?, 'pending')`
    )
    .bind(id, data.name, data.message)
    .run()

  return { id, status: 'pending' }
}

export async function listApprovedFeedback(env: Env) {
  const { results } = await env.feedback_db
    .prepare(
      `SELECT id, name, message, created_at
       FROM feedback
       WHERE status = 'approved'
       ORDER BY created_at DESC`
    )
    .all()

  return results
}

export async function listPendingFeedback(env: Env) {
  const { results } = await env.feedback_db
    .prepare(
      `SELECT * FROM feedback
       WHERE status = 'pending'
       ORDER BY created_at ASC`
    )
    .all()

  return results
}

export async function updateFeedbackStatus(
  env: Env,
  id: string,
  status: 'approved' | 'rejected'
) {
  await env.feedback_db
    .prepare(
      `UPDATE feedback SET status = ? WHERE id = ?`
    )
    .bind(status, id)
    .run()
}
