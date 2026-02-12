import { Hono } from 'hono'
import feedback from './feedback'
import admin from './admin'
import health from './health'
import comments from './comments'

const router = new Hono()

router.route('/health', health)
router.route('/feedback', feedback)
router.route('/comments', comments)
router.route('/admin', admin)

export default router
