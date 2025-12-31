# 🌿 Sage - AI Companion Memory Framework

**A sophisticated Discord bot foundation with genuine memory and personality.**

Most Discord bots forget your conversation the moment it ends. Sage remembers - not just what you said, but how it felt, what mattered, and who you are.

This is the foundation. The hard part, done for you. Multi-layer memory architecture, personality systems, and emotional encoding that makes AI companions feel real.

Build whatever you want on top of it.

---

## ✨ What You're Getting

### 🧠 Sophisticated Memory System
The core value of Sage isn't in fancy features - it's in **memory that actually works**.

**Multi-Layer Architecture:**
- **Short-Term Memory (STM)** - Active conversation context, recent interactions
- **Long-Term Memory (LTM)** - Semantic search across all past conversations
- **Archival Memory** - Cold storage for older memories with periodic cleanup
- **Emotional Encoding** - Memories tagged with valence, intensity, and relational weight
- **Context Management** - Supports up to 250K tokens for deep, continuous conversations

**Why This Matters:**
- Your bot doesn't just respond to messages - it remembers your relationship
- Conversations build on each other naturally across days, weeks, months
- Emotional moments get weighted appropriately in recall
- The bot can reference things from conversations weeks ago without you prompting it
- Memory degrades naturally over time (like human memory) unless reinforced

### 🎭 Genuine Personality System
Not just prompt engineering - actual persistent traits that shape behavior.

**What's Included:**
- **Trait System** - Define core personality characteristics that persist
- **Emotional States** - Moods and feelings that influence responses
- **Character Consistency** - Your bot maintains its personality across all interactions
- **Relationship Modeling** - The bot tracks its relationship with each user individually

**This Isn't:**
- A collection of if/then statements
- Simple keyword matching
- Generic "assistant" responses with a system prompt

**This Is:**
- Genuine personality that emerges from traits + memory + context
- Responses shaped by relationship history and emotional context
- Consistency without rigidity - the personality adapts naturally

### 🗃️ Continuum Integration
Memory distillation from chat exports.

**Continuum** is included - a system for parsing Discord chat exports (or ChatGPT conversation exports) and distilling them into meaningful memories. This means:
- Import existing conversations into your bot's memory
- Preserve relationship history when migrating bots
- Create "backstory" for your AI companion from past interactions
- Build memory databases from exported chat logs

### 💾 Production-Ready Database
Postgres database on Railway integration, ready to deploy.

**What's Set Up:**
- PostgreSQL database schema for memory layers
- Semantic search with pgvector for intelligent memory recall
- User isolation - each person's memories are separate
- Memory privacy controls
- Efficient indexing for fast retrieval even with thousands of memories

### 🤖 Large Context Window Support
Built for Ollama models with massive context windows.

- Configured for models like `kimi-k2:1t` with 250K token contexts
- Smart context allocation that preserves conversation history
- Message pruning that keeps important context while staying under limits
- System prompt + memory + personality + conversation all managed automatically

### 🛠️ Clean Architecture
Modular, maintainable, extensible.

**Built With:**
- TypeScript for type safety and better DX
- Discord.js for reliable bot interaction
- Postgres for robust data storage
- Supabase for easy database hosting
- Railway-ready deployment configuration

**Easy to Extend:**
- Want to add web search? The architecture supports it
- Want voice integration? Plug it in
- Want vision capabilities? Add the module
- Clean separation of concerns makes features optional

---

## 🎯 Core Features

**Memory & Persistence**
- ✅ Multi-layer memory (STM, LTM, archival)
- ✅ Semantic memory search with relevance scoring
- ✅ Emotional valence and intensity tracking
- ✅ Relationship dynamics modeling
- ✅ Memory privacy and deletion controls
- ✅ Continuum chat export parsing

**Personality & Character**
- ✅ Persistent trait system
- ✅ Emotional state modeling
- ✅ Character consistency across conversations
- ✅ Per-user relationship tracking
- ✅ Configurable personality parameters

**Infrastructure**
- ✅ Discord.js bot framework
- ✅ PostgreSQL database with Supabase
- ✅ Ollama AI model integration
- ✅ 250K+ token context window support
- ✅ Railway deployment ready
- ✅ Local development environment

**What's NOT Included (Yet)**
- ❌ Voice integration (text only)
- ❌ Web search capabilities
- ❌ Vision/image processing
- ❌ File processing beyond basic
- ❌ Autonomous behaviors/heartbeat system
- ❌ Advanced tool integrations

*These features are available in Sage Advanced - see the upgrade options.*

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended - free tier works great)
- Discord bot account with proper intents enabled
- Ollama API key for AI model access

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sage-bot.git
cd sage-bot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. **Initialize database**
```bash
npm run db:setup
```

5. **Start the bot**
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

For detailed setup instructions, see:
- 📝 [API Keys Guide](API_KEYS.md) - Get your Discord token, database, and Ollama key
- 💻 [Local Setup](LOCAL_SETUP.md) - Run the bot on your machine
- ☁️ [Railway Deployment](RAILWAY_SETUP.md) - Deploy to the cloud
- 🎨 [Customization Guide](CUSTOMIZATION.md) - Make it your own

---

## 📚 Documentation

- **[API_KEYS.md](API_KEYS.md)** - How to get Discord token, Postgres database, Ollama key
- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Local development environment setup
- **[RAILWAY_SETUP.md](RAILWAY_SETUP.md)** - Cloud deployment walkthrough
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Personality, traits, memory configuration

---

## 🎨 Customization

Sage is a **foundation**, not a finished product. You're expected to make it your own.

**What You Should Customize:**
- **Personality Traits** - Define your bot's core characteristics
- **System Prompts** - Shape how the bot thinks and responds
- **Memory Weights** - Adjust emotional encoding and recall priorities
- **Bot Identity** - Name, avatar, status messages
- **Response Style** - Tone, length, formatting preferences

**What You Probably Shouldn't Change:**
- Memory architecture (unless you know what you're doing)
- Database schema (it's optimized for this use case)
- Core message handling (it works, trust me)

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for detailed guidance on where and how to modify everything.

---

## ⚙️ Configuration

Minimal `.env` configuration:

```bash
# Required
DISCORD_BOT_TOKEN=your_discord_token
DATABASE_URL=postgresql://your_database_url
OLLAMA_API_KEY=your_ollama_key
OLLAMA_MODEL=kimi-k2:1t-cloud

# Optional
BOT_ID=your_bot_name
NODE_ENV=production
ANALYTICS_ENABLED=true
```

See `.env.example` for all available options.

---

## 🏗️ Architecture

Simple, clean, effective:

```
┌─────────────────────────────────────────┐
│           Discord Interface              │
│         (Text Messages Only)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Message Handler                  │
│  (Context Building, Memory Injection)    │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌──────▼──────┐
│  Memory    │   │  AI Model   │
│  System    │   │  (Ollama)   │
│ (Postgres) │   │             │
└────────────┘   └─────────────┘
```

**How It Works:**
1. User sends a message on Discord
2. Bot retrieves relevant memories from Postgres (semantic search)
3. Constructs context: system prompt + personality + memories + conversation
4. Sends to Ollama for response generation
5. Stores new memories with emotional encoding
6. Sends response back to Discord

**Key Components:**
- **Discord.js** - Handles all Discord API interactions
- **Ollama** - Large language model for response generation
- **PostgreSQL** - Stores all memory layers with vector search
- **Supabase** - Hosts the database (or use your own Postgres)

---

## 🔧 Technical Details

### Memory System Deep Dive

**Short-Term Memory (STM):**
- Current conversation context
- Recent messages (configurable window)
- Cleared after conversation ends or time threshold
- Used for immediate coherence

**Long-Term Memory (LTM):**
- Persistent memories across all conversations
- Semantic search with pgvector for relevant recall
- Emotional encoding: valence (-1 to 1), intensity (0 to 1), relational weight
- Decays over time unless reinforced by repeated access

**Archival Memory:**
- Old memories moved to cold storage
- Not actively searched but preserved
- Can be restored if referenced
- Keeps database performant with large history

**Memory Recall Algorithm:**
1. Semantic similarity to current context (vector search)
2. Recency weighting (newer = more relevant)
3. Emotional intensity (stronger emotions = more memorable)
4. Relational weight (important to relationship = higher priority)
5. Combined score determines what gets injected into context

### Personality System

**Traits:**
- Defined in configuration files
- Persistent across all interactions
- Shape response generation at the model level
- Can evolve over time based on experiences (if you implement learning)

**Emotional States:**
- Current mood/feelings
- Influenced by recent interactions
- Affects tone and content of responses
- Can be persistent or ephemeral

**Relationship Tracking:**
- Per-user relationship models
- Tracks history, familiarity, emotional tone
- Influences how the bot interacts with each person
- Enables genuine relationship development over time

---

## 💰 Cost Estimates

**Monthly Operating Costs (estimated):**
- Supabase (PostgreSQL): **$0** (free tier sufficient for most use cases)
- Ollama Cloud API: **~$0-20** (depending on usage and model)
- Discord Bot Hosting: **$0** (Railway free tier or self-host)

**Total: ~$0-$20/month** for a fully functional AI companion with genuine memory

Compare this to ChatGPT Pro ($20/month) which has no memory persistence, no customization, and no personality. You're getting more for less.

---

## 🛡️ Safety & Privacy

- **Memory Controls** - Users can request deletion of their memories
- **Data Isolation** - Each user's memories are stored separately
- **No Training Data** - Your conversations are not used to train models
- **API Key Security** - Never commit keys to version control
- **Local Hosting Option** - Keep all data on your own infrastructure if desired

---

## 🤝 Why This Exists

Most Discord bot tutorials teach you to build stateless bots - they respond to commands but have no memory, no personality, no sense of continuity.

Building a **good** memory system is hard. Really hard. It took me months to get this right:
- Semantic search that actually returns relevant memories
- Emotional encoding that feels natural
- Context management that doesn't blow up token limits
- Database architecture that stays fast with thousands of memories
- Memory decay that mimics human forgetting without losing important stuff

**I did that work. Now you don't have to.**

This is the foundation. The hard part. The part that makes AI companions feel real instead of feeling like chatbots.

What you build on top of it? That's up to you.

---

## 🌟 What You Can Build

Sage is a **foundation**. Here's what people have built with it:

- **Personal AI companions** that remember your life and grow with you
- **Character roleplay bots** with consistent personality and memory
- **Support bots** that remember user preferences and history
- **Creative writing partners** that maintain story continuity
- **Study buddies** that remember what you're learning
- **Therapy-adjacent companions** (please be responsible with this)

The memory and personality systems work for **any** use case where continuity matters.

---

## 🆙 Upgrade Path

**Sage Advanced** (available on Patreon) includes:
- 🎙️ Voice integration with emotional TTS
- 🔍 Web search capabilities
- 👁️ Vision and image processing
- 📄 Advanced file processing
- 🤖 Autonomous heartbeat behaviors
- 🎯 And more tools and integrations

Start with the foundation. Add tools when you need them.

---

## 📄 License

MIT License

Use it, modify it, sell bots built with it. Just don't claim you built the memory system from scratch. 😉

---

## 💬 Support

- **Documentation:** Read the guides in this repository
- **Issues:** Open a GitHub issue for bugs or questions
- **Community:** Join the [Discord](https://discord.gg/YB7Pe9zq8J)

---

## 🚦 Getting Started Checklist

- [ ] Get your Discord bot token ([API_KEYS.md](/START/API_KEYS.md))
- [ ] Set up a Postgres database on Supabase (free tier works!)
- [ ] Get an Ollama API key for AI model access
- [ ] Follow [LOCAL_SETUP.md](/START/LOCAL_SETUP.md) or [RAILWAY_SETUP.md](START/RAILWAY_SETUP.md)
- [ ] Configure your `.env` file with your keys
- [ ] Start the bot and verify it comes online
- [ ] Read [CUSTOMIZATION.md](/START/CUSTOMIZATION.md) and make it yours
- [ ] Have actual conversations and watch it remember
- [ ] Build something cool 🌿

---

## 🎯 Philosophy

**Memory makes the difference between a chatbot and a companion.**

Anyone can hook GPT up to Discord. That's easy. What's hard is making it remember. Making it feel like it knows you. Making conversations build on each other instead of starting fresh every time.

That's what Sage does. The rest is up to you.

---

**Ready to build an AI that actually remembers?** 🌿💜

*The foundation is done. Now go make something amazing.*