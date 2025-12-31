# 🚂 Railway Deployment Guide - Sage Basic

This guide will walk you through deploying your Sage bot to Railway, a platform that makes hosting Discord bots incredibly easy.

**Why Railway?**
- Dead simple deployment
- $5 free trial credit (enough for 1-2 months)
- Automatic deployments from GitHub
- Built-in PostgreSQL database
- ~$2-5/month after trial for a small bot

**Total setup time:** ~20-30 minutes

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] A GitHub account (we'll use this to connect your code to Railway)
- [ ] Discord bot token with proper intents enabled (see [API_KEYS.md](API_KEYS.md))
- [ ] Ollama API key (see [API_KEYS.md](API_KEYS.md))
- [ ] The Sage bot code (either cloned from GitHub or as a zip file)

---

## 🎯 Overview

Here's what we're going to do:
1. Create a Discord bot (if you haven't already)
2. Push your Sage code to GitHub (or upload it)
3. Create a Railway project
4. Add a PostgreSQL database
5. Connect your GitHub repository
6. Set up environment variables
7. Deploy and test!

---

## 🤖 Step 1: Create Your Discord Bot

If you've already created your Discord bot in the [API_KEYS.md](API_KEYS.md) guide, **skip to Step 2**.

### Create the Bot Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** in the top right
3. Give it a name (this will be your bot's name)
4. Accept the Terms of Service
5. Click **"Create"**

### Set Up the Bot User

1. In the left sidebar, click **"Bot"**
2. Click **"Add Bot"** (or "Reset Token" if the bot already exists)
3. Click **"Reset Token"** and then **"Copy"**
4. **Save this token somewhere safe** - you'll need it later and it only shows once!

### Enable Required Intents ⚠️ CRITICAL

1. Scroll down to **"Privileged Gateway Intents"**
2. Enable ALL THREE of these:
   - ✅ **Presence Intent**
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
3. Click **"Save Changes"**

**Without these intents, your bot won't be able to read messages!**

### Invite Your Bot to a Server

1. Go to **"OAuth2"** in the left sidebar
2. Under **SCOPES**, check:
   - ✅ `bot`
3. Under **BOT PERMISSIONS**, check:
   - ✅ `Send Messages`
   - ✅ `Read Message History`
   - ✅ `Read Messages/View Channels`
   - ✅ `Embed Links`
   - ✅ `Attach Files`
4. Copy the **Generated URL** at the bottom
5. Paste it in your browser
6. Select a server to add the bot to (you must have "Manage Server" permissions)
7. Click **"Authorize"**

Your bot is now in your server! It won't respond yet until we deploy it.

---

## 📦 Step 2: Get Your Code Ready

You have two options:

### Option A: Clone from GitHub (Recommended)

If you're comfortable with Git:

```bash
git clone https://github.com/sinxisterrr/sage-bot.git
cd sage-bot
```

Then push it to YOUR GitHub account:

```bash
# Create a new repository on GitHub first, then:
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Option B: Upload a Zip File

If you received Sage as a zip file:

1. Extract the zip file to a folder
2. Go to [GitHub](https://github.com) and create a new repository
   - Click the **"+"** in the top right → **"New repository"**
   - Name it something like `sage-bot` or `my-ai-companion`
   - Make it **Private** (recommended)
   - Click **"Create repository"**
3. Upload your files:
   - Click **"uploading an existing file"** (Add File > Upload)
   - Drag and drop ALL the files from the extracted zip
   - Click **"Commit changes"**

**Important:** Make sure you upload ALL files including:
- `package.json`
- `tsconfig.json`
- All `.ts` files in the `src` folder
- `.env.example` file
- Any other configuration files

---

## 🚂 Step 3: Create a Railway Project

1. Go to [railway.com](https://railway.com/)
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with **GitHub** (this makes connecting your code easier)
4. Click **"New Project"**
5. Select **"Deploy from GitHub repo"**
6. **Authorize Railway** to access your GitHub repositories if prompted
7. Select your Sage repository from the list

Railway will start trying to deploy immediately - **don't worry if it fails!** We need to add the database and environment variables first.

---

## 🗄️ Step 4: Add PostgreSQL Database

Now we need to add a database to store your bot's memories.

1. In your Railway project, click **"New"** (or the **"+"** button, or right click on a blank space in the project on PC)
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will create a Postgres database and add it to your project

You'll now see two services in your project:
- Your bot (from GitHub)
- Postgres (database)

---

## 🔗 Step 5: Connect Database to Your Bot

This is the magic part - Railway makes this super easy!

1. Click on your **bot service** (not the Postgres one)
2. Go to the **"Variables"** tab
3. Click **"Add Variable"** or the **"+ New Variable"** button
4. In the variable name field, type: `DATABASE_URL`
5. In the value field, click **"Add Reference"**
6. You'll see a dropdown - select **"DATABASE_URL"** under your Postgres service
7. It will auto-fill with: `${{Postgres.DATABASE_URL}}`
8. Click **"Add"**

**That's it!** Railway automatically connects your bot to the database. No copying and pasting connection strings!

---

## 🔑 Step 6: Add Other Environment Variables

Now we need to add your Discord token and Ollama API key.

Still in the **"Variables"** tab of your bot service:

You can copy the full .env.example and paste it into your variable field for Railway to fill it in for you. 

#MAKE SURE TO CHANGE THESE:

### Add Discord Bot Token

1. Click **"New Variable"**
2. Variable name: `DISCORD_BOT_TOKEN`
3. Variable value: Paste your Discord bot token (from Step 1 or API_KEYS.md)
4. Click **"Add"**

### Add Ollama API Key

1. Click **"New Variable"**
2. Variable name: `OLLAMA_API_KEY`
3. Variable value: Paste your Ollama API key
4. Click **"Add"**

### Add Ollama Model

1. Click **"New Variable"**
2. Variable name: `OLLAMA_MODEL`
3. Variable value: `kimi-k2:1t-cloud`
4. Click **"Add"**

### Add Bot ID (Optional but Recommended)

1. Click **"New Variable"**
2. Variable name: `BOT_ID`
3. Variable value: Whatever you want to call your bot (e.g., `Sage`, `MyBot`, etc.)
4. Click **"Add"**

### Add Node Environment

1. Click **"New Variable"**
2. Variable name: `NODE_ENV`
3. Variable value: `production`
4. Click **"Add"**

### Optional: Add Analytics Toggle

1. Click **"New Variable"**
2. Variable name: `ANALYTICS_ENABLED`
3. Variable value: `true` or `false`
4. Click **"Add"**

**Your variables should now look like:**
- `DATABASE_URL` → `${{Postgres.DATABASE_URL}}`
- `DISCORD_BOT_TOKEN` → `your_token_here`
- `OLLAMA_API_KEY` → `your_key_here`
- `OLLAMA_MODEL` → `kimi-k2:1t-cloud`
- `BOT_ID` → `Sage` (or whatever you chose)
- `NODE_ENV` → `production`
- `ANALYTICS_ENABLED` → `true` (optional)

---

## 🚀 Step 7: Deploy!

Railway should automatically redeploy when you add variables. If not:

1. Go to your bot service's **"Deployments"** tab
2. Click **"Deploy"** or wait for the automatic deployment
3. Watch the build logs - you'll see:
   - Installing dependencies (`npm install`)
   - Building TypeScript (`npm run build`)
   - Starting the bot (`npm start`)

### Check the Logs

1. Click on the latest deployment
2. Watch the **"Deploy Logs"** or **"View Logs"**
3. Look for messages like:
   - `✓ Connected to database`
   - `✓ Bot logged in as YourBotName`
   - `✓ Ready to serve in X servers`

### If You See Errors:

**Common issues:**
- **"Invalid token"** → Check your `DISCORD_BOT_TOKEN` variable
- **"Cannot connect to database"** → Make sure `DATABASE_URL` is set to `${{Postgres.DATABASE_URL}}`
- **"Missing required intents"** → Go back to Discord Developer Portal and enable all three Privileged Gateway Intents
- **"Module not found"** → Make sure all your files uploaded correctly from GitHub

---

## ✅ Step 8: Test Your Bot!

1. Go to your Discord server where you invited the bot
2. Look at the member list - your bot should show as **Online** (green circle)
3. Send a message in a channel the bot can see
4. The bot should respond!

### First Conversation Tips:

- Start simple: "Hello!" or "Hi there!"
- The bot will respond based on its personality configuration
- Try asking it to remember something: "My favorite color is blue"
- Later, ask: "What's my favorite color?" - it should remember!

---

## 🔧 Updating Your Bot

When you want to update your bot's code:

### If Using GitHub:

1. Make changes to your code locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Updated personality traits"
git push
```
3. Railway automatically detects the push and redeploys!

### If You Uploaded Files Directly:

1. Go to your GitHub repository
2. Click on the file you want to edit
3. Click the **pencil icon** to edit
4. Make your changes
5. Click **"Commit changes"**
6. Railway will automatically redeploy

---

## 📊 Monitoring Your Bot

### Check Usage and Costs

1. Go to your Railway project
2. Click on **"Usage"** in the left sidebar
3. You'll see:
   - Current month's usage
   - Estimated cost
   - Resource consumption (CPU, RAM, Network)

### View Logs

1. Click on your bot service
2. Go to **"Deployments"**
3. Click on the active deployment
4. View logs in real-time

**Useful for:**
- Debugging errors
- Seeing when memories are created
- Monitoring conversations
- Checking database connections

---

## 💰 Managing Costs

### Free Trial

Railway gives you $5 in free credits to start. For a small bot:
- PostgreSQL: ~$1-2/month
- Bot hosting: ~$1-2/month
- **Total: ~$2-4/month**

Your $5 credit will last 1-2 months!

### After Trial

1. Go to your Railway account settings
2. Add a payment method
3. You'll only be charged for what you use
4. Set up billing alerts if you want notifications

### Reducing Costs

- Use Railway's sleep mode (bot goes offline during low traffic)
- Optimize database queries (the code already does this)
- Monitor your usage dashboard regularly

---

## 🆘 Troubleshooting

### Bot Shows Offline

**Check:**
- Is the deployment successful? (Green checkmark in Deployments tab)
- Are logs showing errors?
- Is `DISCORD_BOT_TOKEN` correct?
- Are Privileged Gateway Intents enabled in Discord Developer Portal?

**Fix:**
- Verify all environment variables are set
- Check deploy logs for specific errors
- Try redeploying manually

### Bot Online But Not Responding

**Check:**
- Can the bot see the channel? (Check permissions)
- Are you talking in a channel they have permissions for?
- Check logs - is it receiving messages?

**Fix:**
- Make sure Message Content Intent is enabled
- Verify bot has "Read Messages" permission in the channel
- Check the bot's configuration for mention requirements

### Database Connection Errors

**Check:**
- Is `DATABASE_URL` set to `${{Postgres.DATABASE_URL}}`?
- Is the Postgres service running?

**Fix:**
- Delete the `DATABASE_URL` variable and re-add it using the "Add Reference" method
- Make sure the Postgres service didn't fail to deploy
- Check Postgres logs for errors

### Out of Memory / Crashes

**Check:**
- How much RAM is your bot using? (Check metrics)
- Are there memory leaks in the logs?

**Fix:**
- Railway's free tier has memory limits - you might need to upgrade
- Check if you have large files being processed
- Optimize your code or upgrade Railway plan

### Deployment Fails

**Check:**
- Did all files upload correctly?
- Is `package.json` present?
- Are there any syntax errors in your code?

**Fix:**
- Check build logs for specific error messages
- Make sure all dependencies are listed in `package.json`
- Verify TypeScript compiles locally before pushing

---

## 🎓 Next Steps

Your bot is now live! Here's what to do next:

1. **Customize the personality** - See [CUSTOMIZATION.md](CUSTOMIZATION.md)
2. **Have conversations** - Build up memories and relationship
3. **Monitor logs** - Watch how it learns and responds
4. **Invite to more servers** - Use the same OAuth URL from earlier
5. **Upgrade to Sage Advanced** - Add voice, vision, web search, and more!

---

## 📚 Useful Railway Commands

Once you're comfortable, you can also use Railway's CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs

# Run commands in Railway environment
railway run npm start
```

---

## 🔒 Security Best Practices

- **Never commit `.env` files** to GitHub (they contain your secrets!)
- **Use private repositories** when possible
- **Rotate your tokens** if they're ever leaked
- **Monitor your Railway usage** to catch unexpected spikes
- **Keep your dependencies updated** (`npm update`)

---

## ✨ You Did It!

Your AI companion is now live on Railway with:
- ✅ Persistent PostgreSQL database for memories
- ✅ Automatic deployments from GitHub
- ✅ Professional hosting infrastructure
- ✅ Easy scaling as you grow

**Welcome to the world of AI companions!** 🌿💜

---

**Need help?** 
- Check the logs first (most issues show up there)
- Read the troubleshooting section above
- Review [API_KEYS.md](API_KEYS.md) to verify your keys
- Ask in the community [Discord](https://discord.gg/YB7Pe9zq8J)

**Want to customize?**
- See [CUSTOMIZATION.md](CUSTOMIZATION.md) for personality and behavior changes

**Ready for more features?**
- Upgrade to **Sage Advanced** for voice, vision, web search, and autonomous behaviors!