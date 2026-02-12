import { Hono } from 'hono'
import feedback from './feedback'
import admin from './admin'
import health from './health'

const router = new Hono()

router.route('/health', health)
router.route('/feedback', feedback)
router.route('/admin', admin)

export default router
