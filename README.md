# TextCraft

A simple text improvement tool with AI-powered enhancements. Improve your writing for different platforms and styles.

🔗 Live at [tc.wolka.dev](https://tc.wolka.dev)

## Features

- ✨ AI-powered text improvement using Groq API
- 🎨 Multiple writing styles (formal, casual, friendly, professional)
- 📱 Platform-specific optimization (email, social media, documents)
- 🌍 Multi-language support
- 🚀 Fast processing with fallback options

## Quick Start

### Using Docker (Recommended)

1. Clone the repository
2. Set your Groq API key:
   ```bash
   export GROQ_API_KEY=your_api_key_here
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up
   ```
4. Open http://localhost:33000

### Manual Setup

**Backend (Go API):**

```bash
cd api
go mod tidy
go run main.go
```

**Frontend (React):**

```bash
cd ui
npm install
npm run dev
```

## API

- **Improve Text**: `POST /api/improve-text`
- **Health Check**: `GET /health`

## Environment Variables

- `GROQ_API_KEY`: Your Groq API key for AI text processing (optional - has fallback)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Go, Gorilla Mux
- **AI**: Groq API with fallback processing
- **Deployment**: Docker, Docker Compose

## License

MIT — see [LICENSE](LICENSE).
