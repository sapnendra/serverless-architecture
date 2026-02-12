# Quick Deployment Checklist

Use this checklist for rapid deployment. For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Pre-Deployment

- [ ] Node.js 18+ installed
- [ ] Cloudflare account created
- [ ] Vercel account created
- [ ] Code pushed to GitHub (optional but recommended)

## Backend Deployment (15 minutes)

```bash
cd feedback_backend

# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Create production database
wrangler d1 create feedback-db-prod
# Copy the database_id from output

# 4. Update wrangler.jsonc with database_id

# 5. Initialize database
wrangler d1 execute feedback-db-prod --file=./schema.sql

# 6. Generate and set admin API key
openssl rand -base64 32 | pbcopy  # Copies to clipboard
wrangler secret put ADMIN_API_KEY  # Paste the key

# 7. Deploy
npm install
npm test  # Optional
wrangler deploy

# 8. Note your Worker URL
# https://feedback-backend.<subdomain>.workers.dev
```

## Backend Verification

```bash
# Test health endpoint
curl https://feedback-backend.<subdomain>.workers.dev/health

# Should return: {"status":"healthy","timestamp":"2026-02-12T..."}
```

## Frontend Deployment (10 minutes)

```bash
cd feedback_frontend

# 1. Create production environment file
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://feedback-backend.<subdomain>.workers.dev
ADMIN_API_KEY=<paste-your-api-key-here>
EOF

# 2. Update CORS in backend
# Edit feedback_backend/src/app.ts and add:
# 'https://<your-project>.vercel.app' to allowed origins

# 3. Redeploy backend with CORS update
cd ../feedback_backend
wrangler deploy

# 4. Deploy frontend to Vercel
cd ../feedback_frontend
npm install -g vercel
vercel login
vercel --prod

# Or use Vercel dashboard:
# - Import from GitHub
# - Set environment variables
# - Deploy
```

## Frontend Environment Variables (Vercel)

Add these in Vercel dashboard or via CLI:

```bash
# Public (accessible in browser)
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://feedback-backend.<subdomain>.workers.dev

# Private (server-side only)
vercel env add ADMIN_API_KEY production
# Enter: <your-admin-api-key>

# Redeploy to apply
vercel --prod --force
```

## Post-Deployment Verification

### Automated Tests

```bash
# Set your URLs
export FRONTEND_URL="https://<your-project>.vercel.app"
export BACKEND_URL="https://feedback-backend.<subdomain>.workers.dev"

# Backend health
curl "$BACKEND_URL/health"

# Frontend health  
curl "$FRONTEND_URL" -I | grep "200 OK"

# API integration
curl "$BACKEND_URL/feedback"
```

### Manual Tests

Visit your frontend URL and test:

- [ ] **Homepage** - Feedback form and list visible
- [ ] **Submit feedback** - Form submission works
- [ ] **Search** - Search bar filters results
- [ ] **Pagination** - Can navigate pages
- [ ] **Admin dashboard** - `/admin` page accessible
- [ ] **Admin actions** - Can approve/reject feedback
- [ ] **Feedback detail** - `/feedback/[id]` page loads
- [ ] **Comments** - Can add and reply to comments

## Production Checklist

- [ ] Custom domain configured (optional)
- [ ] HTTPS working on both frontend and backend
- [ ] CORS configured with production URLs
- [ ] Admin API key is secure (not in git)
- [ ] Rate limiting tested (max 20 req/min)
- [ ] Database has seed data (optional)
- [ ] Error monitoring setup (optional)
- [ ] Analytics configured (optional)

## Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| CORS error | Add production URL to `feedback_backend/src/app.ts` cors origins, redeploy |
| 401 on admin | Verify `ADMIN_API_KEY` matches in both backend secret and frontend env var |
| Database not found | Check `database_id` in `wrangler.jsonc` matches D1 database |
| Build failure | Run `npm install && npm run build` locally to catch errors |
| Env vars not loading | In Vercel, check variables are set for "Production" environment, redeploy |

## Rollback

### Backend
```bash
cd feedback_backend
wrangler rollback
```

### Frontend
```bash
# In Vercel dashboard:
# Deployments → Find last working → Promote to Production

# Or via CLI:
vercel promote <last-working-deployment-url>
```

## Monitoring

### Cloudflare Dashboard
- Go to: https://dash.cloudflare.com
- Select your Worker
- View: Analytics, Logs (Real-time)

### Vercel Dashboard  
- Go to: https://vercel.com/dashboard
- Select your project
- View: Deployments, Analytics, Logs

### Real-time Logs

```bash
# Backend logs
wrangler tail

# Frontend logs
vercel logs --follow
```

## Cost Estimation

| Service | Free Tier | Expected Cost |
|---------|-----------|---------------|
| Cloudflare Workers | 100k req/day | $0/month |
| Cloudflare D1 | 5M writes/month | $0/month |
| Vercel | 100 GB bandwidth | $0-20/month |
| **Total** | | **$0-20/month** |

## Optional Enhancements

- [ ] Set up CI/CD with GitHub Actions
- [ ] Configure custom domain
- [ ] Add Sentry for error tracking
- [ ] Enable Vercel Analytics
- [ ] Set up uptime monitoring
- [ ] Configure backup automation

## Support

- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Throttling Guide**: [feedback_frontend/THROTTLING.md](feedback_frontend/THROTTLING.md)
- **Feature Documentation**: [feedback_frontend/NEW_FEATURES.md](feedback_frontend/NEW_FEATURES.md)

---

**Deployment Time**: ~25 minutes  
**Difficulty**: Intermediate  
**Cost**: $0-20/month

Need help? See the detailed [DEPLOYMENT.md](DEPLOYMENT.md) guide.
