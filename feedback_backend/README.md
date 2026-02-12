# Serverless Architecture

A serverless feedback management API built with Cloudflare Workers, Hono framework, and Cloudflare D1 database. This project demonstrates modern serverless architecture patterns with edge computing capabilities.

## Features

- **RESTful API** for feedback submission and retrieval
- **Admin Panel** with authentication for feedback moderation
- **Edge Computing** leveraging Cloudflare's global network
- **Serverless Database** using Cloudflare D1 (SQLite)
- **Type-Safe** development with TypeScript
- **Middleware Support** for logging and authentication
- **Comprehensive Testing** with Vitest

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono v4
- **Database**: Cloudflare D1 (SQLite)
- **Language**: TypeScript
- **Testing**: Vitest with Cloudflare Workers Pool
- **Development**: Wrangler CLI

## Project Structure

```
.
├── src/
│   ├── app.ts                 # Application setup
│   ├── index.ts               # Entry point
│   ├── middlewares/
│   │   ├── adminAuth.ts       # Admin authentication middleware
│   │   └── logger.ts          # Request logging middleware
│   ├── routes/
│   │   ├── admin.ts           # Admin endpoints
│   │   ├── feedback.ts        # Public feedback endpoints
│   │   ├── health.ts          # Health check endpoints
│   │   └── index.ts           # Route aggregator
│   ├── services/
│   │   └── feedback.service.ts # Feedback business logic
│   ├── types/
│   │   └── env.ts             # Environment type definitions
│   └── utils/
│       └── response.ts        # Response utilities
├── test/                      # Test files
├── schema.sql                 # Database schema
├── wrangler.jsonc             # Cloudflare Workers configuration
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sapnendra/serverless-architecture.git
cd serverless-architecture
```

2. Install dependencies:
```bash
npm install
```

3. Authenticate with Cloudflare:
```bash
wrangler login
```

4. Create D1 database:
```bash
wrangler d1 create feedback_db
```

5. Update the `database_id` in `wrangler.jsonc` with the ID from the previous command.

6. Initialize the database schema:
```bash
wrangler d1 execute feedback_db --file=./schema.sql
```

## Configuration

### Environment Variables

Configure the following in `wrangler.jsonc`:

- `ADMIN_API_KEY`: API key for admin authentication

For production, use Wrangler secrets:
```bash
wrangler secret put ADMIN_API_KEY
```

### Database Binding

The D1 database is bound as `feedback_db` in the Worker environment.

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## API Endpoints

### Public Endpoints

#### Health Check
```
GET /health
```

#### Submit Feedback
```
POST /feedback
Content-Type: application/json

{
  "name": "John Doe",
  "message": "Great service!"
}
```

#### List Approved Feedback
```
GET /feedback
```

### Admin Endpoints

All admin endpoints require the `X-Admin-API-Key` header.

#### List Pending Feedback
```
GET /admin/feedback/pending
X-Admin-API-Key: your_admin_key
```

#### Approve Feedback
```
PATCH /admin/feedback/:id/approve
X-Admin-API-Key: your_admin_key
```

#### Reject Feedback
```
PATCH /admin/feedback/:id/reject
X-Admin-API-Key: your_admin_key
```

## Testing

Run tests:
```bash
npm test
```

The project uses Vitest with Cloudflare Workers pool for testing edge runtime behavior.

## Deployment

### Quick Deploy

Deploy to Cloudflare Workers:
```bash
# Set production admin API key
wrangler secret put ADMIN_API_KEY

# Deploy
npm run deploy
```

Your Worker will be deployed to `https://feedback-backend.<your-subdomain>.workers.dev`

### Complete Deployment Guide

For production deployment with frontend integration, see:

- **[📘 Complete Deployment Guide](../DEPLOYMENT.md)** - Full step-by-step instructions
- **[✅ Quick Checklist](../DEPLOY_CHECKLIST.md)** - Fast deployment reference

**Production Checklist:**
- [ ] D1 database created and schema initialized
- [ ] `ADMIN_API_KEY` set as Wrangler secret
- [ ] CORS configured with frontend production URL
- [ ] Rate limiting configured appropriately
- [ ] Database backups scheduled

**Post-Deployment:**
```bash
# Test health endpoint
curl https://feedback-backend.<subdomain>.workers.dev/health

# View real-time logs
wrangler tail

# Monitor in Cloudflare Dashboard
# https://dash.cloudflare.com
```

## Database Schema

The application uses a simple feedback table:

```sql
CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Feedback status can be: `pending`, `approved`, or `rejected`.

## Security

- Admin endpoints are protected with API key authentication
- API keys should be stored as Wrangler secrets in production
- Request logging middleware tracks all incoming requests
- Input validation should be implemented for production use

## Performance

- Runs on Cloudflare's edge network for low latency
- Near-zero cold starts with Workers runtime
- D1 database colocated with compute for optimal performance
- Automatic scaling based on demand

## License

MIT

## Repository

[https://github.com/sapnendra/serverless-architecture](https://github.com/sapnendra/serverless-architecture)
