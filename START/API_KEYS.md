# 🔑 API Keys Setup Guide - Sage Basic

This guide will walk you through obtaining the **three** API keys you need for Sage Basic. That's it. Just three.

No voice integration hell. No ten different services. Just the essentials to get your AI companion with genuine memory up and running.

---

## 📋 What You Need

You'll need API keys from these services:
1. **Discord** - Bot token (required)
2. **Railway** - PostgreSQL database (required)
3. **Ollama** - AI model access (required)

Total setup time: ~15-20 minutes

---

## 🤖 Discord Bot Token

**Where:** [Discord Developer Portal](https://discord.com/developers/applications)

This is your bot's identity on Discord. Without this, your bot can't log in.

### Steps:

1. **Go to Discord Developer Portal**
   - Visit [discord.com/developers/applications](https://discord.com/developers/applications)
   - Log in with your Discord account

2. **Create a New Application**
   - Click **"New Application"** in the top right
   - Give your bot a name (you can change this later)
   - Accept the Terms of Service
   - Click **"Create"**

3. **Create the Bot User**
   - In the left sidebar, click **"Bot"**
   - Click **"Add Bot"** (or "Reset Token" if this is an existing app)
   - Confirm by clicking **"Yes, do it!"**

4. **Copy Your Token**
   - Click **"Reset Token"** to generate a fresh token
   - Click **"Copy"** to copy the token
   - **SAVE THIS IMMEDIATELY** - you won't be able to see it again!
   - Paste it somewhere safe (like a password manager or your `.env` file)

5. **Enable Required Intents** ⚠️ **CRITICAL STEP**
   - Scroll down to **"Privileged Gateway Intents"**
   - Enable these three intents:
     - ✅ **Presence Intent**
     - ✅ **Server Members Intent**
     - ✅ **Message Content Intent**
   - Click **"Save Changes"** at the bottom

6. **Invite Your Bot to a Server**
   - Go to **"OAuth2"**
   - Under **SCOPES**, select:
     - ✅ `bot`
   - Under **BOT PERMISSIONS**, select:
     - ✅ `Send Messages`
     - ✅ `Read Message History`
     - ✅ `Read Messages/View Channels`
     - ✅ `Attach Files` (for future use)
     - ✅ `Embed Links`
   - Copy the generated URL at the bottom
   - Paste it in your browser and select a server to add the bot to

**Environment Variable:** `DISCORD_BOT_TOKEN`

> ⚠️ **Security Warning:** Never share your bot token publicly! If it leaks, anyone can control your bot. If compromised, reset it immediately in the Developer Portal.

---

## 🚂 PostgreSQL Database (Railway)

**Where:** [Railway](https://railway.com/)

This is where all your bot's memories live. Railway makes database setup ridiculously easy and the free trial gives you $5 in credits to start.

### Steps:

1. **Create a Railway Account**
   - Go to [railway.com](https://railway.com/)
   - Click **"Start a New Project"** or **"Login"**
   - Sign up with GitHub (recommended) or email

2. **Create a New Project**
   - Click **"New Project"**
   - Select **"Provision PostgreSQL"**
   - Railway will automatically create a PostgreSQL database for you
   - Wait a few seconds for it to spin up

3. **Get Your Database Connection String** (for local development)
   - **Note:** If you're deploying your bot to Railway too, you won't need to copy this manually - see [RAILWAY_SETUP.md](RAILWAY_SETUP.md) for the easier method using service references.
   - **For local development only:**
     - Click on the **PostgreSQL** service in your project
     - Go to the **"Connect"** tab
     - Look for **"Postgres Connection URL"** or **"DATABASE_URL"**
     - Click the **copy icon** to copy the full connection string
     - It should look like: `postgresql://postgres:password@host:port/railway`

4. **Save the Connection String** (local development only)
   - This is your `DATABASE_URL` environment variable for local `.env` file
   - Paste it somewhere safe
   - You'll need this when running the bot locally

**Environment Variable:** `DATABASE_URL`

**Example format:**
```
postgresql://postgres:ABC123xyz@containers-us-west-1.railway.app:5432/railway
```

> 💡 **Pro Tip:** Railway's free trial gives you $5 in credits. A small bot database typically costs $1-3/month, so you get about 1-2 months free to test it out. After that, it's only a few dollars per month.

> ⚠️ **Important:** The connection string contains your database password. Never commit it to GitHub or share it publicly!

---

## 🧠 Ollama API Key

**Where:** [Ollama Cloud](https://ollama.com/)

This is what powers your bot's brain - the AI model that generates responses.

### Steps:

1. **Create an Ollama Account**
   - Go to [ollama.com](https://ollama.com/)
   - Click **"Sign Up"** or **"Get Started"**
   - Create an account with email or GitHub

2. **Navigate to API Keys**
   - Once logged in, look for [**"API Keys"**](https://ollama.com/settings/keys) in your dashboard
   - Or go directly to your account settings
   - Find the API section

3. **Generate an API Key**
   - Click **"Create API Key"** or **"New API Key"**
   - Give it a name (e.g., "Sage Bot")
   - Click **"Create"**
   - **Copy the key immediately** - some services only show it once

4. **Save Your API Key**
   - This is your `OLLAMA_API_KEY` environment variable
   - Store it securely
   - You'll add this to your `.env` file or Raiway variables.

**Environment Variables:**
- `OLLAMA_API_KEY` - Your API key
- `OLLAMA_MODEL` - Default: `kimi-k2:1t-cloud` (250K context window)

> 💡 **Why Ollama?** Ollama Cloud is free with 100% uptime completely remote. No monster of a GPU required. If you go over hourly or weekly usage, you can also upgrade it for $20USD.

> 💡 **Alternative:** If you prefer, you can use OpenRouter, OpenAI, or other LLM providers - you'll just need to modify the model integration slightly.

---

## ✅ Final Checklist

Before moving on to setup, make sure you have:

- [ ] Discord bot token (starts with a long string of letters/numbers)
- [ ] Discord bot has all three Privileged Gateway Intents enabled
- [ ] Discord bot is invited to your test server
- [ ] Railway PostgreSQL database connection URL
- [ ] Ollama API key

**Next Steps:**
- 💻 Set up locally: See [LOCAL_SETUP.md](LOCAL_SETUP.md)
- ☁️ Deploy to Railway: See [RAILWAY_SETUP.md](RAILWAY_SETUP.md)

---

## 🆘 Troubleshooting

**"My Discord bot won't come online!"**
- Double-check you copied the entire bot token with no extra spaces
- Make sure all three Privileged Gateway Intents are enabled
- Verify the token is in your `.env` file as `DISCORD_BOT_TOKEN`
- Try resetting the token and using the new one

**"Database connection failed!"**
- Make sure you copied the entire Railway connection URL
- Check that there are no spaces or line breaks in the URL
- Verify your Railway project is still running (check the dashboard)
- Make sure you're using the `DATABASE_URL` from the "Connect" tab

**"Ollama API key says invalid!"**
- Some services take a few minutes to activate new keys - wait and try again
- Double-check you copied the entire key
- Make sure you're putting it in the right environment variable (`OLLAMA_API_KEY`)
- Verify your Ollama account has credits/is in good standing

**"I don't see my bot in Discord!"**
- Make sure you used the OAuth2 URL to invite it to your server
- Check that you selected the right server when inviting
- Verify the bot has permission to view the channel you're testing in
- Make sure the bot is actually running (check your terminal/logs)

---

## 💰 Cost Breakdown

Here's what you can expect to spend:

**Discord:** Free ✨  
**Railway PostgreSQL:** ~$1-3/month (free $5 trial credit to start)  
**Ollama Cloud API:** Free (with option to upgrade to $20/month if you hit usage limits)

**Total: ~$1-3/month** (or up to $21-23/month if you need the Ollama upgrade)

That's less than a fancy coffee, and you're getting an AI that actually remembers you. 🌿

---

**Need more help?** Check out the main [README.md](README.md) or the setup guides! 💜

---

**Got all your keys?** Let's get this thing running! 🔥  
Next: [LOCAL_SETUP.md](LOCAL_SETUP.md) or [RAILWAY_SETUP.md](RAILWAY_SETUP.md)