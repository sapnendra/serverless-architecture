# Feedback Platform - Frontend

Production-grade Next.js frontend for the Serverless Feedback Platform.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **shadcn/ui** components
- **Lucide React** icons

## Features

### Public Area
- Submit feedback with name and message
- View all approved feedback
- Real-time form validation
- Success/error states
- Responsive design

### Admin Area
- View pending feedback in a table
- Approve or reject feedback with one click
- Real-time UI updates
- Secured with API key authentication

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see feedback_backend folder)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8787

# Admin API Key (server-side only)
ADMIN_API_KEY=your_admin_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Deployment

For production deployment, see:

- **[📘 Complete Deployment Guide](../DEPLOYMENT.md)** - Detailed step-by-step instructions
- **[✅ Quick Deployment Checklist](../DEPLOY_CHECKLIST.md)** - Fast reference guide
- **[⚡ Throttling Documentation](./THROTTLING.md)** - Search optimization guide
- **[🎁 New Features Guide](./NEW_FEATURES.md)** - Recent feature additions

**Quick Deploy:**
```bash
# Frontend to Vercel
vercel --prod

# Or use Vercel Dashboard
# Import from GitHub → Auto-deploy
```

**Requirements:**
- Backend deployed to Cloudflare Workers
- Environment variables configured
- CORS updated with production URL

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete instructions.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (public feedback)
│   ├── admin/
│   │   └── page.tsx        # Admin dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── feedback/           # Feedback-related components
│   │   ├── FeedbackForm.tsx
│   │   ├── FeedbackCard.tsx
│   │   └── FeedbackList.tsx
│   ├── admin/              # Admin-specific components
│   │   ├── AdminTable.tsx
│   │   └── StatusBadge.tsx
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   └── table.tsx
│   └── common/             # Shared components
│       ├── Container.tsx
│       ├── PageHeader.tsx
│       ├── LoadingState.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── api.ts              # API client
│   └── utils.ts            # Utility functions
├── types/
│   └── feedback.ts         # TypeScript types
└── config/
    └── api.ts              # API configuration
```

## API Integration

The frontend integrates with the backend API endpoints:

### Public Endpoints
- `GET /feedback` - List approved feedback
- `POST /feedback` - Submit new feedback

### Admin Endpoints (requires X-API-Key header)
- `GET /admin/feedback/pending` - List pending feedback
- `PATCH /admin/feedback/:id/approve` - Approve feedback
- `PATCH /admin/feedback/:id/reject` - Reject feedback

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `ADMIN_API_KEY` | Admin API key for authentication | Yes (server-side) |

## Design Principles

- **Minimalist & Clean**: Professional UI without unnecessary flourishes
- **Accessible**: WCAG compliant with proper contrast and semantic HTML
- **Responsive**: Mobile-first approach
- **Extensible**: Easy to add new features
- **Type-Safe**: Full TypeScript coverage

## Development Notes

- Uses Server Components by default for optimal performance
- Client Components only where interactivity is needed
- API calls centralized in `lib/api.ts`
- Shared types in `types/` for consistency
- No hardcoded values - uses config files

## Future Enhancements

The architecture supports easy addition of:
- Pagination for feedback lists
- Search and filtering
- User authentication
- Analytics dashboard
- Role-based access control
- Real-time updates with WebSockets

## License

MIT
