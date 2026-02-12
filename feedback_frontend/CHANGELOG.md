# API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Feedback Management](#feedback-management)
  - [Admin Operations](#admin-operations)

## Overview

This API provides endpoints for managing user feedback with an admin moderation system. The API is built on Cloudflare Workers and uses Cloudflare D1 for data persistence.

**Key Features:**
- RESTful architecture
- JSON request/response format
- API key authentication for admin operations
- Edge-deployed for global low-latency access
- Automatic scaling

## Base URL

**Development:**
```
http://localhost:8787
```

**Production:**
```
https://serverless-playground.business-sapnendra29.workers.dev
```

## Authentication

### Admin Authentication

Admin endpoints require API key authentication using the `X-API-Key` header.

**Header:**
```
X-API-Key: your_admin_api_key
```

**Example:**
```bash
curl -H "X-API-Key: sk_admin_9f83kds93kdf_32jskd" \
  https://api.example.com/admin/feedback/pending
```

### Public Endpoints

Public endpoints do not require authentication.

## Response Format

All API responses follow a consistent JSON format:

**Success Response:**
```json
{
  "success": true,
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing API key |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error |

### Error Response Examples

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Invalid request body"
}
```

## Rate Limiting

Rate limiting is handled by Cloudflare's infrastructure. Standard limits apply:
- 100,000 requests per day (free tier)
- 1,000 requests per minute per IP

## Endpoints

---

### Health Check

Check the API health and server time.

**Endpoint:** `GET /health`

**Authentication:** None

**Request:**
```bash
curl https://api.example.com/health
```

**Response:** `200 OK`
```json
{
  "status": "ok",
  "time": "2026-02-08T10:30:45.123Z"
}
```

---

### Feedback Management

#### Submit Feedback

Submit new feedback for moderation.

**Endpoint:** `POST /feedback`

**Authentication:** None

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "message": "This is my feedback message"
}
```

**Field Specifications:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Name of the person submitting feedback |
| message | string | Yes | Feedback message content |

**Request Example:**
```bash
curl -X POST https://api.example.com/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "message": "Great service! Very impressed."
  }'
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "pending"
  }
}
```

**Notes:**
- Feedback is created with `pending` status by default
- A unique UUID is generated for each feedback
- Feedback requires admin approval before appearing publicly

---

#### List Approved Feedback

Retrieve all approved feedback entries.

**Endpoint:** `GET /feedback`

**Authentication:** None

**Request:**
```bash
curl https://api.example.com/feedback
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "message": "Great service! Very impressed.",
      "created_at": "2026-02-08T10:30:45.123Z"
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "Jane Smith",
      "message": "Excellent experience, highly recommended!",
      "created_at": "2026-02-07T15:22:10.456Z"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique feedback identifier (UUID) |
| name | string | Name of the feedback author |
| message | string | Feedback content |
| created_at | string | ISO 8601 timestamp of creation |

**Notes:**
- Only returns feedback with `approved` status
- Results are ordered by creation date (newest first)
- Does not include rejected or pending feedback

---

### Admin Operations

All admin endpoints require the `X-API-Key` header for authentication.

---

#### List Pending Feedback

Retrieve all feedback awaiting moderation.

**Endpoint:** `GET /admin/feedback/pending`

**Authentication:** Required (Admin API Key)

**Headers:**
```
X-API-Key: your_admin_api_key
```

**Request:**
```bash
curl https://api.example.com/admin/feedback/pending \
  -H "X-API-Key: sk_admin_9f83kds93kdf_32jskd"
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "message": "This is awaiting approval",
      "status": "pending",
      "created_at": "2026-02-08T10:30:45.123Z"
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "Jane Smith",
      "message": "Another pending feedback",
      "status": "pending",
      "created_at": "2026-02-08T11:15:30.789Z"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique feedback identifier (UUID) |
| name | string | Name of the feedback author |
| message | string | Feedback content |
| status | string | Always "pending" for this endpoint |
| created_at | string | ISO 8601 timestamp of creation |

**Error Responses:**

`401 Unauthorized` - Invalid or missing API key:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Notes:**
- Results are ordered by creation date (oldest first)
- Only includes feedback with `pending` status

---

#### Approve Feedback

Approve a pending feedback to make it publicly visible.

**Endpoint:** `PATCH /admin/feedback/:id/approve`

**Authentication:** Required (Admin API Key)

**Headers:**
```
X-API-Key: your_admin_api_key
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Feedback UUID to approve |

**Request:**
```bash
curl -X PATCH https://api.example.com/admin/feedback/550e8400-e29b-41d4-a716-446655440000/approve \
  -H "X-API-Key: sk_admin_9f83kds93kdf_32jskd"
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Error Responses:**

`401 Unauthorized` - Invalid or missing API key:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Notes:**
- Changes feedback status from `pending` to `approved`
- Approved feedback becomes visible in the public feedback list
- Operation is idempotent - can be called multiple times safely

---

#### Reject Feedback

Reject a pending feedback to prevent it from being displayed.

**Endpoint:** `PATCH /admin/feedback/:id/reject`

**Authentication:** Required (Admin API Key)

**Headers:**
```
X-API-Key: your_admin_api_key
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Feedback UUID to reject |

**Request:**
```bash
curl -X PATCH https://api.example.com/admin/feedback/550e8400-e29b-41d4-a716-446655440000/reject \
  -H "X-API-Key: sk_admin_9f83kds93kdf_32jskd"
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Error Responses:**

`401 Unauthorized` - Invalid or missing API key:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Notes:**
- Changes feedback status from `pending` to `rejected`
- Rejected feedback will not appear in any public endpoints
- Operation is idempotent - can be called multiple times safely

---

## Code Examples

### JavaScript/TypeScript

#### Submit Feedback
```javascript
async function submitFeedback(name, message) {
  const response = await fetch('https://api.example.com/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, message }),
  });
  
  const data = await response.json();
  return data;
}

// Usage
const result = await submitFeedback('John Doe', 'Great service!');
console.log(result);
```

#### List Approved Feedback
```javascript
async function getFeedback() {
  const response = await fetch('https://api.example.com/feedback');
  const data = await response.json();
  return data.data;
}

// Usage
const feedbackList = await getFeedback();
console.log(feedbackList);
```

#### Admin: Approve Feedback
```javascript
async function approveFeedback(feedbackId, apiKey) {
  const response = await fetch(
    `https://api.example.com/admin/feedback/${feedbackId}/approve`,
    {
      method: 'PATCH',
      headers: {
        'X-API-Key': apiKey,
      },
    }
  );
  
  const data = await response.json();
  return data;
}

// Usage
await approveFeedback('550e8400-e29b-41d4-a716-446655440000', 'sk_admin_...');
```

### Python

#### Submit Feedback
```python
import requests

def submit_feedback(name, message):
    url = 'https://api.example.com/feedback'
    payload = {
        'name': name,
        'message': message
    }
    response = requests.post(url, json=payload)
    return response.json()

# Usage
result = submit_feedback('John Doe', 'Great service!')
print(result)
```

#### Admin: List Pending Feedback
```python
import requests

def get_pending_feedback(api_key):
    url = 'https://api.example.com/admin/feedback/pending'
    headers = {'X-API-Key': api_key}
    response = requests.get(url, headers=headers)
    return response.json()

# Usage
pending = get_pending_feedback('sk_admin_...')
print(pending)
```

### cURL

#### Complete Workflow Example
```bash
# 1. Check API health
curl https://api.example.com/health

# 2. Submit feedback
curl -X POST https://api.example.com/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","message":"Great service!"}'

# 3. View pending feedback (admin)
curl https://api.example.com/admin/feedback/pending \
  -H "X-API-Key: sk_admin_9f83kds93kdf_32jskd"

# 4. Approve feedback (admin)
curl -X PATCH https://api.example.com/admin/feedback/FEEDBACK_ID/approve \
  -H "X-API-Key: sk_admin_9f83kds93kdf_32jskd"

# 5. View approved feedback (public)
curl https://api.example.com/feedback
```

---

## Database Schema

The API uses the following database schema:

```sql
CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Status Values:**
- `pending` - Awaiting admin review
- `approved` - Visible to public
- `rejected` - Hidden from public view

---

## Changelog

### Version 0.0.0 (2026-02-08)

**Initial Release**
- Health check endpoint
- Public feedback submission and retrieval
- Admin authentication middleware
- Admin feedback moderation (approve/reject)
- D1 database integration
- Request logging middleware
- TypeScript implementation with Hono framework

---

## Support

For issues, questions, or contributions, please visit:
[https://github.com/sapnendra/serverless-architecture](https://github.com/sapnendra/serverless-architecture)
