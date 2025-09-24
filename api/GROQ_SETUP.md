# Groq AI Integration Setup

This guide explains how to set up and use Groq AI for text improvement in your Phrasing Craft API.

## 🚀 What is Groq?

Groq is an AI inference company that provides extremely fast AI model inference. They offer:

- **Speed**: 1000+ tokens per second
- **Free Tier**: Available for testing and development
- **Models**: Llama 2, Mixtral, and other popular models
- **API**: OpenAI-compatible API

## 📋 Prerequisites

1. **Groq Account**: Sign up at [console.groq.com](https://console.groq.com)
2. **API Key**: Get your API key from the Groq console
3. **Go Environment**: Your Go development environment

## 🔧 Setup Instructions

### Step 1: Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (it starts with `gsk_...`)

### Step 2: Set Environment Variable

#### Option A: Export in Terminal (Temporary)

```bash
export GROQ_API_KEY="your_groq_api_key_here"
```

#### Option B: Add to Shell Profile (Permanent)

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
echo 'export GROQ_API_KEY="your_groq_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

#### Option C: Create .env File (Development)

```bash
# Create .env file in the api directory
echo "GROQ_API_KEY=your_groq_api_key_here" > api/.env
```

### Step 3: Test the Integration

1. **Start the API server**:

   ```bash
   cd api
   go run main.go
   ```

2. **Test with curl**:

   ```bash
   curl -X POST http://localhost:8080/api/improve-text \
     -H "Content-Type: application/json" \
     -d '{
       "text": "hi, i hope you are doing well. i wanted to ask if we can meet tomorrow to discuss the project.",
       "style": "formal",
       "platform": "email",
       "language": "en"
     }'
   ```

3. **Expected Response**:
   ```json
   {
     "originalText": "hi, i hope you are doing well...",
     "improvedText": "Hello, I hope you are doing well. I would like to schedule a meeting tomorrow to discuss the project.",
     "style": "formal",
     "platform": "email",
     "language": "en",
     "timestamp": "2024-01-15T10:30:00Z",
     "processingTime": "1.2s"
   }
   ```

## 🐳 Docker Setup

### Option 1: Environment Variable in Docker Compose

Add to your `docker-compose.yml`:

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
    # ... rest of config
```

Then run:

```bash
export GROQ_API_KEY="your_groq_api_key_here"
docker-compose up --build
```

### Option 2: .env File with Docker

1. Create `.env` file in project root:

   ```bash
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

2. Update `docker-compose.yml`:

   ```yaml
   services:
     api:
       build:
         context: ./api
         dockerfile: Dockerfile
       env_file:
         - .env
       # ... rest of config
   ```

3. Run with Docker:
   ```bash
   docker-compose up --build
   ```

## 🔍 How It Works

### 1. **Request Flow**

```
Frontend → API → Groq AI → Enhanced Text → Frontend
```

### 2. **Fallback System**

- **Primary**: Groq AI (if API key is set)
- **Fallback**: Enhanced local processing (if Groq fails)

### 3. **Prompt Engineering**

The system creates optimized prompts for different styles:

- **Formal**: "Make it formal and professional"
- **Friendly**: "Make it friendly and warm"
- **Casual**: "Make it casual and conversational"
- **Professional**: "Make it professional and business-focused"
- **Typo/Grammar**: "Fix typos and grammar errors"

## 📊 Performance

### Groq Performance

- **Speed**: ~1-3 seconds per request
- **Quality**: High-quality text improvements
- **Languages**: Supports multiple languages
- **Cost**: Free tier available

### Fallback Performance

- **Speed**: <100ms per request
- **Quality**: Basic improvements (typos, capitalization)
- **Languages**: All supported languages
- **Cost**: Free (local processing)

## 🛠️ Troubleshooting

### Common Issues

#### 1. "GROQ_API_KEY not set" Error

```bash
# Check if environment variable is set
echo $GROQ_API_KEY

# If empty, set it:
export GROQ_API_KEY="your_api_key_here"
```

#### 2. API Rate Limits

- Groq has rate limits on free tier
- If you hit limits, the system will fall back to local processing
- Consider upgrading to paid tier for higher limits

#### 3. Network Issues

- Check internet connection
- Verify Groq API is accessible
- System will automatically fall back to local processing

#### 4. Invalid API Key

```bash
# Test your API key
curl -H "Authorization: Bearer $GROQ_API_KEY" \
     https://api.groq.com/openai/v1/models
```

### Debug Mode

Add debug logging by setting:

```bash
export DEBUG=true
```

This will show:

- Which AI provider is being used
- API response times
- Fallback triggers

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for API keys**
3. **Rotate API keys regularly**
4. **Monitor API usage in Groq console**
5. **Set up rate limiting if needed**

## 📈 Monitoring

### Groq Console

- Monitor API usage at [console.groq.com](https://console.groq.com)
- Track request counts and costs
- Set up usage alerts

### Application Logs

```bash
# View API logs
docker-compose logs api

# Follow logs in real-time
docker-compose logs -f api
```

## 🚀 Advanced Configuration

### Custom Models

You can change the Groq model in `main.go`:

```go
Model: "llama2-70b-4096", // Current model
// Available models:
// - "llama2-70b-4096" (fastest)
// - "mixtral-8x7b-32768" (balanced)
// - "gemma-7b-it" (smaller, faster)
```

### Custom Prompts

Modify the `buildPrompt` function to customize AI behavior:

```go
func buildPrompt(request TextImprovementRequest) string {
    // Your custom prompt logic here
}
```

## 📚 Additional Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq Models](https://console.groq.com/docs/models)
- [API Reference](https://console.groq.com/docs/api-reference)
- [Rate Limits](https://console.groq.com/docs/rate-limits)

## 🎯 Next Steps

1. **Test the integration** with different text styles
2. **Monitor performance** and adjust as needed
3. **Consider upgrading** to paid tier for production use
4. **Add more AI providers** for redundancy (Hugging Face, Ollama, etc.)

---

**Need help?** Check the logs or create an issue in the project repository.
