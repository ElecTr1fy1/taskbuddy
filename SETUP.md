# TaskBuddy v2 — Setup Guide

## What you need (5-10 minutes total)

1. **GitHub account** (free) — to store the code
2. **Supabase account** (free) — for the database
3. **Vercel account** (free) — to host the app
4. **Anthropic API key** — for AI features
5. **Telegram Bot Token** (optional) — for the Telegram bot

---

## Step 1: Push code to GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repo called `taskbuddy`
2. Push this folder to the repo:
   ```bash
   cd taskbuddy-v2
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/taskbuddy.git
   git push -u origin main
   ```

## Step 2: Set up Supabase (database)

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **"New Project"**
3. Give it a name (e.g., "taskbuddy"), pick a region close to you, set a password
4. Wait for the project to spin up (~1 min)
5. Go to **SQL Editor** (left sidebar)
6. Copy & paste the contents of `supabase/schema.sql` and click **Run**
7. Go to **Settings → API** and copy these values:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Go to **API Keys** and create a new key
4. Copy it → This is your `ANTHROPIC_API_KEY`

## Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**
3. Import your `taskbuddy` repository
4. Before deploying, add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = (from Step 2)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from Step 2)
   - `SUPABASE_SERVICE_ROLE_KEY` = (from Step 2)
   - `ANTHROPIC_API_KEY` = (from Step 3)
   - `TELEGRAM_BOT_TOKEN` = (from Step 5, if setting up Telegram)
   - `ALLOWED_TELEGRAM_USERS` = (your Telegram user ID, optional)
5. Click **Deploy**
6. Your app will be live at `https://taskbuddy-xxxxx.vercel.app` 🎉

## Step 5: Set up Telegram Bot (optional)

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Copy the bot token → Add it as `TELEGRAM_BOT_TOKEN` in Vercel env vars
4. Set the webhook URL by visiting this URL in your browser:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://your-vercel-app.vercel.app/api/telegram/webhook
   ```
5. To find your Telegram user ID, message [@userinfobot](https://t.me/userinfobot)
6. Add your user ID as `ALLOWED_TELEGRAM_USERS` in Vercel (optional, for security)

---

## You're done! 🎉

- **Web app**: Visit your Vercel URL
- **Telegram**: Message your bot naturally to add tasks
- **Cost**: $0/month (only pay for Claude API usage, which is pennies)
