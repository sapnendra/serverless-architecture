import { Env } from '../types/env'

export async function createComment(env: Env, data: {
  feedbackId: string
  authorName: string
  content: string
  parentCommentId?: string
}) {
  const id = crypto.randomUUID()

  await env.feedback_db
    .prepare(
      `INSERT INTO comments (id, feedback_id, parent_comment_id, author_name, content)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(id, data.feedbackId, data.parentCommentId || null, data.authorName, data.content)
    .run()

  return { id, created_at: new Date().toISOString() }
}

export async function listComments(env: Env, feedbackId: string) {
  const { results } = await env.feedback_db
    .prepare(
      `SELECT id, feedback_id, parent_comment_id, author_name, content, created_at
       FROM comments
       WHERE feedback_id = ?
       ORDER BY created_at ASC`
    )
    .bind(feedbackId)
    .all()

  return results
}

export async function getCommentThread(env: Env, feedbackId: string) {
  const comments = await listComments(env, feedbackId)
  
  // Build threaded structure
  const commentMap = new Map()
  const rootComments: any[] = []

  // First pass: create all comment objects
  comments.forEach((comment: any) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // Second pass: build the tree
  comments.forEach((comment: any) => {
    const commentObj = commentMap.get(comment.id)
    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id)
      if (parent) {
        parent.replies.push(commentObj)
      }
    } else {
      rootComments.push(commentObj)
    }
  })

  return rootComments
}
