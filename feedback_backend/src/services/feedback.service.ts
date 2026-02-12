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

export async function listApprovedFeedback(
  env: Env,
  options: {
    page?: number
    limit?: number
    search?: string
  } = {}
) {
  const page = options.page || 1
  const limit = options.limit || 10
  const offset = (page - 1) * limit
  const search = options.search || ''

  let query = `SELECT id, name, message, created_at
       FROM feedback
       WHERE status = 'approved'`
  const params: any[] = []

  if (search) {
    query += ` AND (name LIKE ? OR message LIKE ?)`
    params.push(`%${search}%`, `%${search}%`)
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const { results } = await env.feedback_db
    .prepare(query)
    .bind(...params)
    .all()

  // Get total count for pagination
  let countQuery = `SELECT COUNT(*) as total FROM feedback WHERE status = 'approved'`
  const countParams: any[] = []
  
  if (search) {
    countQuery += ` AND (name LIKE ? OR message LIKE ?)`
    countParams.push(`%${search}%`, `%${search}%`)
  }

  const countResult = await env.feedback_db
    .prepare(countQuery)
    .bind(...countParams)
    .first()

  return {
    results,
    pagination: {
      page,
      limit,
      total: (countResult as any)?.total || 0,
      totalPages: Math.ceil(((countResult as any)?.total || 0) / limit),
    },
  }
}

export async function listPendingFeedback(
  env: Env,
  options: {
    page?: number
    limit?: number
    search?: string
  } = {}
) {
  const page = options.page || 1
  const limit = options.limit || 10
  const offset = (page - 1) * limit
  const search = options.search || ''

  let query = `SELECT * FROM feedback WHERE status = 'pending'`
  const params: any[] = []

  if (search) {
    query += ` AND (name LIKE ? OR message LIKE ?)`
    params.push(`%${search}%`, `%${search}%`)
  }

  query += ` ORDER BY created_at ASC LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const { results } = await env.feedback_db
    .prepare(query)
    .bind(...params)
    .all()

  // Get total count
  let countQuery = `SELECT COUNT(*) as total FROM feedback WHERE status = 'pending'`
  const countParams: any[] = []
  
  if (search) {
    countQuery += ` AND (name LIKE ? OR message LIKE ?)`
    countParams.push(`%${search}%`, `%${search}%`)
  }

  const countResult = await env.feedback_db
    .prepare(countQuery)
    .bind(...countParams)
    .first()

  return {
    results,
    pagination: {
      page,
      limit,
      total: (countResult as any)?.total || 0,
      totalPages: Math.ceil(((countResult as any)?.total || 0) / limit),
    },
  }
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
