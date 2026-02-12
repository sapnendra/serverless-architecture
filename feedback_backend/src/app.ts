import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from './middlewares/logger'
import { rateLimit } from './middlewares/rateLimit'
import routes from './routes'

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}))

app.use('*', rateLimit)
app.use('*', logger)

// attach all routes
app.route('/', routes)

export default app
