# 50,000-Item Zero-Allocation Virtualized Web Application

A high-performance full-stack application designed to serve, stream, filter, and render **50,000 user records** with sub-millisecond API response times and fluid 60–120 FPS DOM virtualization in a clean, modern **Light/White Theme**.

Built with an **Express.js** in-memory slicing backend and a **React 19** frontend adhering strictly to the **Single Responsibility Principle (SRP)**, zero-allocation hot paths, sliding-window cache eviction (`maxPages: 6`), and hardware-accelerated CSS smooth scrolling.

---

## Architecture Highlights

```
┌────────────────────────────────────────────────────────┐
│             Express.js Server (Port 5001)              │
│  - 50,000 pre-joined records in server/data/users.json │
│  - Zero runtime string concatenation allocations       │
│  - O(1) in-memory array slice pagination               │
│  - Dynamic multi-filter: search, location, skill, age  │
│  - Bounds checking: 50 <= limit <= 100, offset >= 0    │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON (Vite /api proxy)
                           │ Native AbortSignal Ejection
┌──────────────────────────▼─────────────────────────────┐
│       React 19 White-Theme Virtualizer (Port 5173)     │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Data Layer (@tanstack/react-query)               │  │
│  │ - useVirtualizedUsers: maxPages=6 sliding window │  │
│  │ - V8 Heap Cap: <= 600 records in memory          │  │
│  │ - Proactive buffer prefetching (2 pages ahead)   │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Clean White UI & Multi-Filters                   │  │
│  │ - Search Bar: Live instant debounced search      │  │
│  │ - Location Dropdown: 25 cities dynamically loaded│  │
│  │ - Skill Dropdown & Quick Chips (React, Python...)│  │
│  │ - Age Range: <30, 30-45, 45+ yrs                 │  │
│  │ - Sorting: Default, Name (A-Z), Age              │  │
│  │ - UserRow: Clean white card, ROW_HEIGHT = 72px   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### Step 1: Install Dependencies

```bash
# 1. Install Express backend dependencies
npm --prefix server install

# 2. Install React frontend dependencies
npm --prefix reactassign install
```

---

### Step 2: Generate 50,000 User Records (Seed)

```bash
npm --prefix server run seed
```

> **Output**: Generates `server/data/users.json` (~9.1 MB) containing 50,000 realistic records with `id`, `name`, `age`, `location`, `skillsLabel`, and `avatarSeed`.

---

### Step 3: Run the Development Servers

Open two terminal windows:

#### Terminal 1 — Start the Express API Server (Port 5001)
```bash
cd ./server

npm run dev
```

#### Terminal 2 — Start the React Frontend (Port 5173)
```bash
cd ./reactassign
npm run dev
```
> Open **http://localhost:5173/** in your browser.

---

## API Documentation & cURL Commands

### Base URLs
- **Direct API**: `http://localhost:5001`
- **Vite Proxied API**: `http://localhost:5173/api`

---

### 1. Get Filter Metadata (Locations & Skills List)
Fetches all unique locations (25 cities) and skills (40 tech skills).

```bash
curl -X GET "http://localhost:5001/api/users/filters" \
  -H "Accept: application/json"
```

---

### 2. Paginated Users with Multi-Filters
Fetches 50 items with location, skill, and age range filters applied.

```bash
curl -X GET "http://localhost:5001/api/users?offset=0&limit=50&location=San%20Francisco,%20CA&skill=React&ageMin=20&ageMax=35" \
  -H "Accept: application/json"
```

---

### 3. Search and Sort (Name A-Z)
```bash
curl -X GET "http://localhost:5001/api/users?offset=0&limit=50&search=Developer&sortBy=name&sortOrder=asc" \
  -H "Accept: application/json"
```

---

### 4. Health Check
```bash
curl -X GET "http://localhost:5001/health" \
  -H "Accept: application/json"
```

---

## Postman Collection Import

To test all endpoints in **Postman**:
1. Open Postman.
2. Click **Import** (top left).
3. Select **Raw Text** and paste the JSON below:

```json
{
  "info": {
    "name": "50k Users Virtualizer API",
    "_postman_id": "c1f7b8e2-9014-4e2b-a82f-50kusersapi",
    "description": "Postman collection for testing the 50,000-item virtualized Express API with search and filters.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Filter Metadata",
      "request": {
        "method": "GET",
        "header": [{ "key": "Accept", "value": "application/json" }],
        "url": {
          "raw": "http://localhost:5001/api/users/filters",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["api", "users", "filters"]
        }
      }
    },
    {
      "name": "Get Users (Offset 0, Limit 50)",
      "request": {
        "method": "GET",
        "header": [{ "key": "Accept", "value": "application/json" }],
        "url": {
          "raw": "http://localhost:5001/api/users?offset=0&limit=50",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["api", "users"],
          "query": [
            { "key": "offset", "value": "0" },
            { "key": "limit", "value": "50" }
          ]
        }
      }
    },
    {
      "name": "Filter by Location & Skill",
      "request": {
        "method": "GET",
        "header": [{ "key": "Accept", "value": "application/json" }],
        "url": {
          "raw": "http://localhost:5001/api/users?offset=0&limit=50&location=Seattle,%20WA&skill=Rust",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["api", "users"],
          "query": [
            { "key": "offset", "value": "0" },
            { "key": "limit", "value": "50" },
            { "key": "location", "value": "Seattle, WA" },
            { "key": "skill", "value": "Rust" }
          ]
        }
      }
    },
    {
      "name": "Search by Keyword (TypeScript)",
      "request": {
        "method": "GET",
        "header": [{ "key": "Accept", "value": "application/json" }],
        "url": {
          "raw": "http://localhost:5001/api/users?offset=0&limit=50&search=TypeScript",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["api", "users"],
          "query": [
            { "key": "offset", "value": "0" },
            { "key": "limit", "value": "50" },
            { "key": "search", "value": "TypeScript" }
          ]
        }
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [{ "key": "Accept", "value": "application/json" }],
        "url": {
          "raw": "http://localhost:5001/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["health"]
        }
      }
    }
  ]
}
```
