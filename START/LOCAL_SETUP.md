# 💻 Local Development Setup - Sage Basic

This guide will help you run Sage on your own computer for development and testing.

**Why run locally?**
- Test changes instantly without deploying
- No hosting costs while developing
- Full control over the environment
- Learn how everything works under the hood

**What you'll need:**
- A computer (Windows, Mac, or Linux)
- Node.js installed
- Your API keys (Discord, Railway Postgres, Ollama)
- About 30 minutes

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] Node.js 18 or higher installed ([nodejs.org](https://nodejs.org/))
- [ ] Discord bot token with proper intents (see [API_KEYS.md](API_KEYS.md))
- [ ] Railway PostgreSQL database set up (see [API_KEYS.md](API_KEYS.md))
- [ ] Ollama API key (see [API_KEYS.md](API_KEYS.md))
- [ ] A code editor (VS Code recommended: [code.visualstudio.com](https://code.visualstudio.com/))

---

## 🎯 Overview

Here's what we're going to do:
1. Install Node.js and verify installation
2. Get the Sage code onto your computer
3. Install dependencies
4. Create your environment file with API keys
5. Run the bot
6. Test it in Discord!

---

## 📦 Step 1: Install Node.js

If you already have Node.js 18+, **skip to Step 2**.

### Check if you have Node.js

Open your terminal/command prompt and run:

```bash
node --version
```

If you see `v18.x.x` or higher, you're good! Skip to Step 2.

If you get an error or a version lower than 18:

### Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard (default options are fine)
5. Restart your terminal/command prompt
6. Verify installation:

```bash
node --version
npm --version
```

Both should show version numbers.

---

## 🎮 Step 2: Create Your Discord Bot

If you've already created your Discord bot in [API_KEYS.md](API_KEYS.md), **skip to Step 3**.

### Create the Bot Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** in the top right
3. Give it a name (this will be your bot's username)
4. Accept the Terms of Service and click **"Create"**

### Set Up the Bot User

1. Click **"Bot"** in the left sidebar
2. Click **"Add Bot"** (or "Reset Token")
3. Click **"Reset Token"** and then **"Copy"**
4. **Save this token** - you'll need it in Step 4!

### Enable Required Intents ⚠️ CRITICAL

1. Scroll down to **"Privileged Gateway Intents"**
2. Enable ALL THREE:
   - ✅ **Presence Intent**
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
3. Click **"Save Changes"**

### Invite Your Bot to a Server

1. Go to **"OAuth2"** → **"URL Generator"** in the left sidebar
2. Under **SCOPES**, check `bot`
3. Under **BOT PERMISSIONS**, check:
   - ✅ `Send Messages`
   - ✅ `Read Message History`
   - ✅ `Read Messages/View Channels`
   - ✅ `Embed Links`
   - ✅ `Attach Files`
4. Copy the generated URL at the bottom
5. Paste it in your browser and authorize the bot to a server

---

## 📥 Step 3: Get the Code

You have two options:

### Option A: Clone from GitHub (Recommended)

If you have Git installed:

```bash
# Clone the repository
git clone https://github.com/sinxisterrr/sage-bot.git

# Navigate into the folder
cd sage-bot
```

### Option B: Download as ZIP

If you received Sage as a zip file or don't have Git:

1. Download the zip file
2. Extract it to a folder (e.g., `C:\Users\YourName\sage-bot` or `~/sage-bot`)
3. Open your terminal/command prompt
4. Navigate to the folder:

**Windows (PowerShell):**
```powershell
cd C:\Users\YourName\sage-bot
```

**Mac/Linux:**
```bash
cd ~/sage-bot
```

---

## 📦 Step 4: Install Dependencies

Now we need to install all the packages Sage needs to run.

In your terminal (make sure you're in the sage-bot folder):

```bash
npm install
```

This will take a minute or two. You'll see a bunch of packages being downloaded - that's normal!

**If you see warnings (yellow text):** That's usually fine, ignore them.

**If you see errors (red text):** 
- Make sure you're in the right folder (should contain `package.json`)
- Make sure Node.js is properly installed (`node --version`)
- Try running `npm install` again

---

## 🔑 Step 5: Set Up Environment Variables

This is where you tell the bot your API keys and settings.

### Create the .env File

1. In the sage-bot folder, find the file called `.env.example`
2. Make a copy of it and name it `.env` (just `.env`, no `.example`)

**How to do this:**

**Windows (File Explorer):**
- Right-click `.env.example` → **"Copy"**
- Right-click in the folder → **"Paste"**
- Rename the copy to `.env`
- **Note:** Windows might hide the extension, make sure it's `.env` not `.env.txt`

**Mac/Linux (Terminal):**
```bash
cp .env.example .env
```

**VS Code (Easiest):**
- Right-click `.env.example` → **"Copy"**
- Right-click in the file explorer → **"Paste"**
- Rename to `.env`

### Edit the .env File

Open `.env` in your code editor (or Notepad/TextEdit) and fill in your values:

```bash
# Bot Configuration
BOT_ID=Sage
DISCORD_BOT_TOKEN=your_discord_bot_token_here
NODE_ENV=development

# Database (from Railway - see API_KEYS.md)
DATABASE_URL=postgresql://postgres:password@host:port/railway

# Ollama
OLLAMA_API_KEY=your_ollama_api_key_here
OLLAMA_MODEL=kimi-k2:1t-cloud

# Optional Settings
ANALYTICS_ENABLED=true
```

**Important fields:**
- `DISCORD_BOT_TOKEN` - Your Discord bot token from Step 2
- `DATABASE_URL` - Your Railway PostgreSQL connection string from [API_KEYS.md](API_KEYS.md)
- `OLLAMA_API_KEY` - Your Ollama API key from [API_KEYS.md](API_KEYS.md)

**Save the file!**

---

## 🚀 Step 6: Run the Bot

Time to start it up!

### Development Mode (Recommended for Testing)

This will auto-reload when you make code changes:

```bash
npm run dev
```

### Production Mode

This runs the bot normally:

```bash
npm start
```

**Note:** If using `npm start`, you need to build first:
```bash
npm run build
npm start
```

### What You Should See

When the bot starts successfully, you'll see messages like:

```
✓ Connected to database
✓ Loaded 0 memories from database
✓ Bot logged in as YourBotName#1234
✓ Ready to serve in 1 servers
```

**If you see errors**, skip to the Troubleshooting section below.

---

## ✅ Step 7: Test Your Bot!

1. Go to Discord
2. Open the server where you invited your bot
3. Your bot should show as **Online** (green circle)
4. Send a message in a channel the bot can see: `Hello!`
5. The bot should respond!

### First Conversation Tips:

```
You: Hello!
Bot: Hi! How can I help you?

You: Remember that my favorite color is purple
Bot: I'll remember that your favorite color is purple!

You: What's my favorite color?
Bot: Your favorite color is purple!
```

The bot is now storing memories in your Railway database!

---

## 🛠️ Development Workflow

### Making Changes

1. Edit code in your editor (e.g., VS Code)
2. If using `npm run dev`, changes auto-reload
3. If using `npm start`, you need to:
   ```bash
   # Stop the bot (Ctrl+C)
   npm run build
   npm start
   ```
4. Test your changes in Discord

### Useful Commands

```bash
# Install new packages
npm install package-name

# Update dependencies
npm update

# Check for TypeScript errors
npm run build

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm run build && npm start
```

---

## 🔧 Troubleshooting

### Bot Won't Start

**Error: "Cannot find module..."**
- Run `npm install` again
- Make sure you're in the right folder
- Delete `node_modules` folder and run `npm install` again

**How to delete node_modules:**

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules
```

**Mac/Linux:**
```bash
rm -rf node_modules
```

**Then reinstall:**
```bash
npm install
```

### Database Connection Errors

**Error: "Connection refused" or "ECONNREFUSED"**
- Check your `DATABASE_URL` in `.env`
- Make sure you copied the entire connection string from Railway
- Verify your Railway Postgres database is running

**Error: "Invalid database URL"**
- Make sure the URL starts with `postgresql://`
- Check for any extra spaces or line breaks
- Verify the password is correct

### Discord Bot Errors

**Error: "Invalid token" or "Incorrect login credentials"**
- Check `DISCORD_BOT_TOKEN` in `.env`
- Make sure you copied the entire token
- Try resetting the token in Discord Developer Portal

**Bot shows offline even though it's running:**
- Check Privileged Gateway Intents are enabled
- Verify the token is correct
- Check the console for connection errors

### Bot Online But Not Responding

**Possible causes:**
- Message Content Intent not enabled → Enable it in Discord Developer Portal
- Bot doesn't have permission to read messages → Check channel permissions
- Bot is configured to only respond to mentions → Check your configuration

### TypeScript Build Errors

**Error: "Cannot find name..." or type errors**
- Run `npm install` to ensure all types are installed
- Check for syntax errors in your code
- Make sure you're using TypeScript-compatible syntax

### Port Already in Use (if running a web server)

**Error: "EADDRINUSE" or "Port already in use"**
- Another instance of the bot is running → Stop it (Ctrl+C)
- Another program is using that port → Change the port or stop the other program

---

## 💡 Tips and Tricks

### Using VS Code

**Recommended extensions:**
- **ESLint** - Code quality checking
- **Prettier** - Code formatting
- **Error Lens** - Inline error messages

### Debugging

Add `console.log()` statements to see what's happening:

```typescript
console.log('Current memory:', memory);
console.log('User message:', message.content);
```

Check the terminal where your bot is running - you'll see these logs.

### Keeping the Bot Running

**Problem:** Terminal closes, bot stops.

**Solutions:**

**Option 1: Use `screen` (Linux/Mac)** or **PowerShell/Terminal tabs**
- Keep terminal window open
- Bot runs as long as your computer is on

**Option 2: Deploy to Railway**
- Follow [RAILWAY_SETUP.md](RAILWAY_SETUP.md)
- Bot runs 24/7 without your computer

**Option 3: Use PM2 (Advanced)**
```bash
npm install -g pm2
pm2 start npm --name "sage-bot" -- start
pm2 save
```

---

## 🔄 Updating Your Bot

### If You Cloned from GitHub

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies (if package.json changed)
npm install

# Rebuild
npm run build

# Restart
npm start
```

### If You Downloaded a ZIP

1. Download the new version
2. Extract to a new folder
3. Copy your `.env` file from the old folder to the new one
4. Run `npm install` in the new folder
5. Run `npm run dev` or `npm start`

---

## 🎓 Next Steps

Now that your bot is running locally:

1. **Customize the personality** - See [CUSTOMIZATION.md](CUSTOMIZATION.md)
2. **Experiment with code changes** - Try modifying responses or behaviors
3. **Build up conversations** - Watch how memory works
4. **Deploy to Railway** - Keep it running 24/7 (see [RAILWAY_SETUP.md](RAILWAY_SETUP.md))
5. **Upgrade to Sage Advanced** - Add voice, vision, web search!

---

## 📚 Useful Resources

**Learning TypeScript:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

**Discord.js Documentation:**
- [Discord.js Guide](https://discordjs.guide/)
- [Discord.js Documentation](https://discord.js.org/)

**Node.js:**
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [NPM Documentation](https://docs.npmjs.com/)

---

## 🔒 Security Reminders

- **Never commit `.env` files** - They contain your secrets!
- **Add `.env` to `.gitignore`** - It should already be there, but verify
- **Don't share your tokens** - Treat them like passwords
- **Rotate tokens if leaked** - Reset them immediately in Discord Developer Portal

---

## ✨ You're Ready!

Your local development environment is set up! You can now:
- ✅ Run the bot on your computer
- ✅ Make changes and test them instantly
- ✅ Learn how the code works
- ✅ Experiment with new features

**Happy coding!** 🌿💜

---

**Need help?**
- Check the troubleshooting section above
- Review [API_KEYS.md](API_KEYS.md) for key setup
- Look at logs in your terminal for specific errors

**Want to deploy 24/7?**
- See [RAILWAY_SETUP.md](RAILWAY_SETUP.md) for cloud hosting

**Want to customize?**
- See [CUSTOMIZATION.md](CUSTOMIZATION.md) for personality changes