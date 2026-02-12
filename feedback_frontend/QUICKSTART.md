# Quick Start Guide

## 🎉 New Features Added!

**Latest updates include:**
- ✅ **Pagination** - Browse feedback 10 items at a time
- ✅ **Search & Filters** - Find feedback by name or message
- ✅ **Rate Limiting** - Protection against API abuse (20 req/min)
- ✅ **Comment Threading** - Nested discussions on feedback (3 levels deep)

> 📖 See [NEW_FEATURES.md](./NEW_FEATURES.md) for detailed documentation.

---

## 🚀 Development Setup

### 1. Start the Backend

In the `feedback_backend` directory:

```bash
cd feedback_backend
npm run dev
```

Backend will be available at: `http://localhost:8787`

### 2. Start the Frontend

In the `feedback_frontend` directory:

```bash
cd feedback_frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 3. Admin Access

To access the admin dashboard, navigate to: `http://localhost:3000/admin`

The admin API key is configured in `.env.local`:
```
ADMIN_API_KEY=sk_admin_9f83kds93kdf_32jskd
```

## 📋 Testing the Application

### Public Flow

1. Visit `http://localhost:3000`
2. Fill out the feedback form with:
   - Your name
   - A feedback message
3. Click "Submit Feedback"
4. You'll see a success message
5. The feedback will appear in "Recent Feedback" after admin approval
6. **NEW:** Use the search bar to filter feedback
7. **NEW:** Navigate through pages with pagination controls
8. **NEW:** Click "View & Comment" to see details and add comments

### Comment Threading

1. Click "View & Comment" on any approved feedback
2. Navigate to the detail page
3. Click "Add Comment" to write a top-level comment
4. Click "Reply" on any comment to create a nested reply
5. Threading supports up to 3 levels of nesting

### Admin Flow

1. Visit `http://localhost:3000/admin`
2. View all pending feedback in the table
3. Click "Approve" to make feedback public
4. Click "Reject" to hide feedback
5. Approved feedback will appear on the public page

## 🎨 Design Features

- **Clean & Professional**: Minimalist design with calm colors
- **Responsive**: Works on mobile, tablet, and desktop
- **Real-time Updates**: UI updates instantly after actions
- **Loading States**: Shows spinners during API calls
- **Empty States**: Informative messages when no data
- **Error Handling**: Clear error messages

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Cloudflare Workers, Hono, D1 Database
- **Deployment**: Edge-first serverless architecture

## 📁 Project Structure

```
feedback_frontend/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page (public)
│   └── admin/page.tsx     # Admin dashboard
├── components/            # React components
│   ├── feedback/          # Feedback features
│   ├── admin/             # Admin features
│   ├── ui/                # shadcn/ui components
│   └── common/            # Shared components
├── lib/                   # Utilities & API client
├── types/                 # TypeScript types
└── config/                # Configuration files
```

## 🔧 Environment Variables

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
ADMIN_API_KEY=sk_admin_9f83kds93kdf_32jskd
```

## 🌐 API Endpoints

### Public
- `GET /feedback?page=1&limit=10&search=query` - List approved feedback (with pagination & search)
- `POST /feedback` - Submit feedback

### Admin (requires X-API-Key header)
- `GET /admin/feedback/pending?page=1&limit=10&search=query` - List pending feedback
- `PATCH /admin/feedback/:id/approve` - Approve feedback
- `PATCH /admin/feedback/:id/reject` - Reject feedback

### Comments
- `GET /comments/:feedbackId` - Get threaded comments for feedback
- `POST /comments` - Add a comment or reply

## 📦 Build for Production

```bash
# Frontend
cd feedback_frontend
npm run build
npm start

# Backend
cd feedback_backend
npm run deploy
```

## 🎯 Next Steps

This foundation supports easy addition of:
- [x] Pagination ✅
- [x] Search & filters ✅
- [x] Rate limiting ✅
- [x] Comment threading ✅
- [ ] User authentication
- [ ] Analytics dashboard
- [ ] Email notifications

## 📚 Documentation

- Full API documentation: `feedback_frontend/CHANGELOG.md`
- Backend README: `feedback_backend/README.md`
- Frontend README: `feedback_frontend/README.md`

## 🐛 Troubleshooting

**Frontend not loading?**
- Ensure backend is running on port 8787
- Check `.env.local` configuration
- Verify API_URL is correct

**Admin page not working?**
- Verify ADMIN_API_KEY matches backend configuration
- Check browser console for errors

**Feedback not appearing?**
- Check if backend database is initialized
- Run `npm run db:init` in backend directory

**Getting rate limited (429 error)?**
- Wait 1 minute before making more requests
- Rate limit is 20 requests per minute per IP

**Comments not showing?**
- Ensure comments table exists in database
- Check browser console for errors
- Verify backend is running on port 8787

---

Built with ❤️ using serverless architecture
