# Deployment Guide - Serverless Feedback Platform

Complete guide to deploying the feedback platform to production.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Backend Deployment (Cloudflare Workers)](#backend-deployment-cloudflare-workers)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedure](#rollback-procedure)

---

## Overview

### Architecture
```
┌─────────────┐      HTTPS       ┌──────────────────┐
│   Browser   │ ◄──────────────► │  Next.js (Vercel) │
└─────────────┘                  └──────────────────┘
                                          │
                                    HTTPS │ API Calls
                                          ▼
                                 ┌──────────────────┐
                                 │ Cloudflare       │
                                 │ Workers + D1     │
                                 └──────────────────┘
```

### Deployment Targets
- **Backend**: Cloudflare Workers (Edge Runtime)
- **Frontend**: Vercel (Recommended) or any Next.js hosting
- **Database**: Cloudflare D1 (SQLite at the edge)

---

## Prerequisites

### Required Accounts
1. **Cloudflare Account** (Free tier available)
   - Sign up at https://dash.cloudflare.com/sign-up
   - Note your Account ID from the dashboard

2. **Vercel Account** (Free tier available)
   - Sign up at https://vercel.com/signup
   - Connect your GitHub/GitLab account

### Required Tools
```bash
# Node.js 18+ and npm
node --version  # Should be 18.x or higher
npm --version

# Wrangler CLI (Cloudflare Workers CLI)
npm install -g wrangler

# Vercel CLI (optional, for CLI deployment)
npm install -g vercel
```

### GitHub Repository (Recommended)
Push your code to GitHub for easier deployment:
```bash
cd /home/sapnendra/Desktop/Serverless-Architecture
git init
git add .
git commit -m "Initial commit - Serverless Feedback Platform"
git remote add origin <your-repo-url>
git push -u origin main
```

---

## Backend Deployment (Cloudflare Workers)

### Step 1: Authenticate with Cloudflare

```bash
cd feedback_backend

# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

### Step 2: Create D1 Database

```bash
# Create production database
wrangler d1 create feedback-db-prod

# Note the database_id from output, you'll need it for wrangler.jsonc
```

**Example output:**
```
✅ Successfully created DB 'feedback-db-prod'
database_id = "abc123def456ghi789jkl012"
```

### Step 3: Update wrangler.jsonc

Update the `wrangler.jsonc` file with your production database:

```jsonc
{
  "name": "feedback-backend",
  "compatibility_date": "2024-01-01",
  "main": "src/index.ts",
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "feedback-db-prod",
      "database_id": "abc123def456ghi789jkl012"  // ← Use your actual database_id
    }
  ],
  
  "vars": {
    "ADMIN_API_KEY": "CHANGE_THIS_IN_PRODUCTION"  // Will be overridden by secrets
  }
}
```

### Step 4: Initialize Database Schema

```bash
# Apply schema to production database
wrangler d1 execute feedback-db-prod --file=./schema.sql

# Verify tables were created
wrangler d1 execute feedback-db-prod --command="SELECT name FROM sqlite_master WHERE type='table';"
```

**Expected output:**
```
name
----
feedback
comments
```

### Step 5: Set Production Secrets

```bash
# Generate a secure admin API key
openssl rand -base64 32

# Set it as a secret (not in wrangler.jsonc)
wrangler secret put ADMIN_API_KEY
# Paste the generated key when prompted
```

### Step 6: Deploy Backend

```bash
# Install dependencies
npm install

# Run tests (optional but recommended)
npm test

# Deploy to production
wrangler deploy

# Your API will be live at: https://feedback-backend.<your-subdomain>.workers.dev
```

### Step 7: Test Backend Deployment

```bash
# Replace with your actual Workers URL
export BACKEND_URL="https://feedback-backend.<your-subdomain>.workers.dev"

# Test health endpoint
curl "$BACKEND_URL/health"

# Test feedback listing
curl "$BACKEND_URL/feedback"

# Test with your admin API key
curl -X GET "$BACKEND_URL/admin/feedback/pending" \
  -H "x-admin-api-key: YOUR_ADMIN_API_KEY"
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Environment Variables

Create a `.env.production` file in `feedback_frontend/`:

```bash
cd ../feedback_frontend

cat > .env.production << 'EOF'
# Backend API URL (your Cloudflare Workers URL)
NEXT_PUBLIC_API_URL=https://feedback-backend.<your-subdomain>.workers.dev

# Admin API Key (same as backend)
ADMIN_API_KEY=<your-secure-api-key>
EOF
```

### Step 2: Update CORS in Backend

Update `feedback_backend/src/app.ts` to include your production frontend URL:

```typescript
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://<your-domain>.vercel.app',  // ← Add your Vercel domain
      'https://www.<your-domain>.com'      // ← Add custom domain if any
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'x-admin-api-key'],
    credentials: true,
  })
);
```

Redeploy backend after CORS update:
```bash
cd ../feedback_backend
wrangler deploy
```

### Step 3: Deploy to Vercel (Option A: Dashboard)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select `feedback_frontend` as the root directory
4. Framework Preset: **Next.js** (auto-detected)
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Cloudflare Workers URL
   - `ADMIN_API_KEY`: Your admin API key
6. Click **Deploy**

### Step 3: Deploy to Vercel (Option B: CLI)

```bash
cd feedback_frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? feedback-frontend
# - Directory? ./
# - Override settings? No
```

Add environment variables via CLI:
```bash
vercel env add NEXT_PUBLIC_API_URL production
# Enter your Workers URL when prompted

vercel env add ADMIN_API_KEY production
# Enter your admin API key when prompted

# Redeploy to apply env vars
vercel --prod
```

### Step 4: Configure Custom Domain (Optional)

**In Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `feedback.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

**DNS Configuration Example:**
```
Type: CNAME
Name: feedback
Value: cname.vercel-dns.com
```

---

## Database Setup

### Initial Data (Optional)

Seed some approved feedback for testing:

```bash
cd feedback_backend

# Create a seed file
cat > seed.sql << 'EOF'
INSERT INTO feedback (name, email, message, status, created_at)
VALUES 
  ('John Doe', 'john@example.com', 'Great platform! Very intuitive.', 'approved', datetime('now')),
  ('Jane Smith', 'jane@example.com', 'Love the comment threading feature!', 'approved', datetime('now')),
  ('Mike Johnson', 'mike@example.com', 'Fast and responsive UI.', 'approved', datetime('now'));
EOF

# Apply seed data
wrangler d1 execute feedback-db-prod --file=./seed.sql
```

### Database Backups

```bash
# Export data (for backup)
wrangler d1 export feedback-db-prod --output=backup-$(date +%Y%m%d).sql

# Restore from backup
wrangler d1 execute feedback-db-prod --file=backup-20260212.sql
```

### Database Migrations

For future schema changes:

```bash
# 1. Create migration file
cat > migrations/add_votes.sql << 'EOF'
ALTER TABLE feedback ADD COLUMN votes INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN votes INTEGER DEFAULT 0;
EOF

# 2. Apply migration
wrangler d1 execute feedback-db-prod --file=migrations/add_votes.sql

# 3. Update TypeScript types and redeploy
```

---

## Environment Configuration

### Backend Environment Variables

**Set via Wrangler Secrets (Recommended):**
```bash
cd feedback_backend

# Admin API Key (required)
wrangler secret put ADMIN_API_KEY

# Optional: External API keys
wrangler secret put SENDGRID_API_KEY
wrangler secret put SLACK_WEBHOOK_URL
```

**View current secrets:**
```bash
wrangler secret list
```

### Frontend Environment Variables

**Production Variables (Vercel):**
```bash
cd feedback_frontend

# Public variables (accessible in browser)
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_SITE_NAME production

# Private variables (server-side only)
vercel env add ADMIN_API_KEY production

# View all environment variables
vercel env ls
```

**Environment Variable Reference:**

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Public | Backend API URL |
| `ADMIN_API_KEY` | Yes | Private | Admin authentication key |
| `NEXT_PUBLIC_SITE_NAME` | No | Public | Site name for branding |

---

## Post-Deployment Verification

### Automated Health Checks

```bash
# Set your URLs
FRONTEND_URL="https://feedback-frontend.vercel.app"
BACKEND_URL="https://feedback-backend.<subdomain>.workers.dev"

# Backend health check
echo "Testing backend..."
curl -f "$BACKEND_URL/health" || echo "❌ Backend health check failed"

# Frontend health check
echo "Testing frontend..."
curl -f "$FRONTEND_URL" -o /dev/null || echo "❌ Frontend health check failed"

# Test API integration
echo "Testing feedback API..."
curl -f "$BACKEND_URL/feedback" | jq '.results | length'

echo "✅ All checks passed!"
```

### Manual Testing Checklist

- [ ] **Public Feedback Page** (`/`)
  - [ ] Submit feedback form works
  - [ ] Approved feedback displays
  - [ ] Pagination works
  - [ ] Search/filter works
  - [ ] Rate limiting triggers after 20 requests

- [ ] **Admin Dashboard** (`/admin`)
  - [ ] Login/authentication works
  - [ ] Pending feedback displays
  - [ ] Approve/reject actions work
  - [ ] Real-time updates work

- [ ] **Feedback Detail Page** (`/feedback/[id]`)
  - [ ] Feedback details display
  - [ ] Comments load
  - [ ] Add comment works
  - [ ] Reply to comment works (3 levels)

- [ ] **Performance**
  - [ ] Page load < 3 seconds
  - [ ] API response < 500ms
  - [ ] Search throttling works
  - [ ] No console errors

### Monitoring Setup

**Cloudflare Workers Analytics:**
1. Go to https://dash.cloudflare.com
2. Select your Worker
3. Navigate to **Analytics** tab
4. Monitor: Requests, Errors, CPU time, Duration

**Vercel Analytics:**
1. Go to your project in Vercel dashboard
2. Navigate to **Analytics** tab
3. Monitor: Page views, Performance, Errors

**Set Up Alerts:**
```bash
# Cloudflare: Set up notifications for Worker errors
# Vercel: Set up deployment notifications

# Optional: Uptime monitoring
# Use services like UptimeRobot, Pingdom, or Better Uptime
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptom:** Browser shows CORS policy errors
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solution:**
```bash
cd feedback_backend

# Update src/app.ts with your frontend URL
# Redeploy
wrangler deploy
```

#### 2. 401 Unauthorized on Admin Actions

**Symptom:** Admin approve/reject returns 401

**Solution:**
```bash
# Verify ADMIN_API_KEY is set correctly
cd feedback_backend
wrangler secret list

# Check frontend env var matches
cd feedback_frontend
vercel env ls

# Ensure they match!
```

#### 3. Database Not Found

**Symptom:** Worker logs show "Database binding not found"

**Solution:**
```bash
cd feedback_backend

# Verify database exists
wrangler d1 list

# Check wrangler.jsonc has correct database_id
# Redeploy
wrangler deploy
```

#### 4. Build Failures

**Backend Build Error:**
```bash
cd feedback_backend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
```

**Frontend Build Error:**
```bash
cd feedback_frontend

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build
```

#### 5. Environment Variables Not Loading

**Frontend:**
```bash
# In Vercel, go to Settings → Environment Variables
# Make sure variables are set for "Production"
# Redeploy after adding/changing env vars

vercel --prod --force
```

**Backend:**
```bash
# List secrets
wrangler secret list

# Update secret
wrangler secret put ADMIN_API_KEY

# Redeploy
wrangler deploy
```

#### 6. Rate Limiting Too Aggressive

**Symptom:** Users getting 429 Too Many Requests

**Solution:**
```typescript
// In feedback_backend/src/middlewares/rateLimit.ts
// Increase limit from 20 to 50
const RATE_LIMIT_REQUESTS = 50;  // requests per window
const RATE_LIMIT_WINDOW = 60000; // 1 minute

// Redeploy
wrangler deploy
```

### Debug Mode

**Enable verbose logging:**

Backend:
```typescript
// In feedback_backend/src/app.ts
app.use(logger());

// Check logs
wrangler tail
```

Frontend:
```bash
# Vercel deployment logs
vercel logs <deployment-url>

# Real-time logs
vercel logs --follow
```

---

## Rollback Procedure

### Backend Rollback

```bash
cd feedback_backend

# View deployment history
wrangler deployments list

# Rollback to previous deployment
wrangler rollback --deployment-id <deployment-id>

# Or rollback to previous version
wrangler rollback
```

### Frontend Rollback

**Via Vercel Dashboard:**
1. Go to Deployments tab
2. Find the last working deployment
3. Click "•••" menu → **Promote to Production**

**Via CLI:**
```bash
cd feedback_frontend

# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

### Database Rollback

```bash
cd feedback_backend

# Restore from backup
wrangler d1 execute feedback-db-prod --file=backup-20260212.sql

# Or rollback specific migration
wrangler d1 execute feedback-db-prod --file=migrations/rollback.sql
```

---

## Production Optimizations

### Performance

1. **Enable Edge Caching:**
```typescript
// In feedback_backend/src/routes/feedback.ts
app.get('/feedback', async (c) => {
  // Add cache headers
  c.header('Cache-Control', 'public, max-age=60, s-maxage=300');
  // ... rest of handler
});
```

2. **Next.js Image Optimization:**
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={200} 
  height={50} 
  alt="Logo"
  priority
/>
```

3. **Enable Brotli Compression:**
```javascript
// next.config.js
module.exports = {
  compress: true,
  // ... other config
};
```

### Security

1. **Add Security Headers:**
```typescript
// In feedback_backend/src/app.ts
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});
```

2. **Rate Limit by IP + User Agent:**
```typescript
// In feedback_backend/src/middlewares/rateLimit.ts
const clientId = `${ip}-${userAgent}`;
```

3. **Input Validation:**
```typescript
// Add input sanitization
import { z } from 'zod';

const feedbackSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});
```

### Monitoring

1. **Custom Analytics:**
```typescript
// Track feedback submissions
app.post('/feedback', async (c) => {
  // ... create feedback
  
  // Track metric
  c.executionCtx.waitUntil(
    fetch('https://analytics.example.com/event', {
      method: 'POST',
      body: JSON.stringify({ event: 'feedback_submitted' })
    })
  );
});
```

2. **Error Tracking (Sentry):**
```bash
npm install @sentry/nextjs

# Follow setup wizard
npx @sentry/wizard@latest -i nextjs
```

---

## Cost Estimation

### Cloudflare Workers (Backend)

**Free Plan:**
- 100,000 requests/day
- 10ms CPU time per request
- Unlimited D1 reads
- 5 million D1 writes/month

**Paid Plan ($5/month):**
- 10 million requests/month
- Additional requests: $0.50 per million

**Expected costs for moderate traffic (10k users/month):**
- Free tier should be sufficient
- Estimated: **$0/month**

### Vercel (Frontend)

**Hobby Plan (Free):**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**Pro Plan ($20/month):**
- 1 TB bandwidth/month
- Team collaboration
- Advanced analytics

**Expected costs for moderate traffic:**
- Hobby plan sufficient for < 10k visitors/month
- Estimated: **$0-20/month**

### Total Estimated Costs

| Traffic Level | Monthly Cost |
|--------------|--------------|
| < 10k visitors | $0 (Free tiers) |
| 10k-50k visitors | $0-20 (Vercel Pro) |
| 50k-100k visitors | $5-25 (CF + Vercel Pro) |
| 100k+ visitors | $25-50 (Scale as needed) |

---

## CI/CD Pipeline (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: feedback_backend
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          workingDirectory: feedback_backend

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    defaults:
      run:
        working-directory: feedback_frontend
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: feedback_frontend
```

**Setup secrets in GitHub:**
- `CF_API_TOKEN`: Cloudflare API token
- `VERCEL_TOKEN`: Vercel token
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`

---

## Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- [ ] Check error logs
- [ ] Review analytics
- [ ] Monitor rate limit hits

**Monthly:**
- [ ] Database backup
- [ ] Review and optimize queries
- [ ] Update dependencies
- [ ] Security audit

**Quarterly:**
- [ ] Review and update documentation
- [ ] Performance optimization
- [ ] Cost analysis and optimization

### Getting Help

- **Cloudflare Workers:** https://community.cloudflare.com/
- **Vercel:** https://vercel.com/support
- **Next.js:** https://nextjs.org/docs
- **Hono:** https://hono.dev/

---

## Conclusion

Your serverless feedback platform is now deployed! 🚀

**Quick Links:**
- Frontend: `https://<your-project>.vercel.app`
- Backend API: `https://feedback-backend.<subdomain>.workers.dev`
- Cloudflare Dashboard: https://dash.cloudflare.com
- Vercel Dashboard: https://vercel.com/dashboard

**Next Steps:**
1. Set up custom domain
2. Configure analytics
3. Enable error tracking
4. Set up CI/CD pipeline
5. Plan for scaling

For issues or questions, refer to the Troubleshooting section above.
