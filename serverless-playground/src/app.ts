import { Hono } from 'hono'
import { logger } from './middlewares/logger'
import routes from './routes'

const app = new Hono()

app.use('*', logger)

// attach all routes
app.route('/', routes)

export default app
