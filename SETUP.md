# 🔧 Setup Guide

Detailed instructions to get started.

## Prerequisites

- **Node.js 16+** — [Download](https://nodejs.org)
- **YouTube API Key** — Free from Google Cloud  

## Step 1: Get API Key

### Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select Project** → **New Project**
3. Name it (e.g., "YouTube Analytics")
4. Wait for creation

### Enable YouTube API
1. Go to **APIs & Services** → **Library**
2. Search "youtube data api v3"
3. Click **YouTube Data API v3**
4. Click **ENABLE**

### Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. **Copy** the key

## Step 2: Configure Project

### Copy Template
```bash
cp .env.example .env.local
```

### Add Key
Edit `.env.local`:
```env
VITE_YOUTUBE_API_KEY=AIzaSyDr78jfJ90njsl48yZtYmQD-yhIZ19pgZQ
```

> ⚠️ Never commit `.env.local` to git (protected by `.gitignore`)

## Step 3: Install
```bash
npm install
```

## Step 4: Run
```bash
npm run dev
```

Open `http://localhost:8000` ✅

---

## Troubleshooting

**"API Key invalid"**
- Verify key is copied correctly
- Check YouTube API v3 is **enabled** in Google Cloud
- Check quota [here](https://console.cloud.google.com/apis/dashboard)

**".env.local not found"**
- Make sure you created the file
- Restart dev server after creating it

---

## Next Steps

- [Quick Start](QUICK_START.md) — 5-minute overview
- [README](README.md) — Features & usage
