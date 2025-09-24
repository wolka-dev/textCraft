# TextCraft API

A minimal Go API server for the TextCraft application with text improvement capabilities.

## Features

- 📝 **Text Improvement Endpoint**: Processes and improves text based on style, platform, and language preferences
- 🏥 **Health Check**: Simple health check endpoint
- 🌐 **CORS Support**: Cross-origin resource sharing enabled for web frontend integration
- 📦 **Minimal Dependencies**: Uses only Gorilla Mux for routing
- ⚡ **Fast Processing**: Optimized text processing with timing metrics

## Setup

### Prerequisites

- Go 1.21 or higher

### Installation

1. Navigate to the api directory:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   go mod tidy
   ```

3. Run the server:
   ```bash
   go run main.go
   ```

The server will start on `http://localhost:8080`

## API Endpoints

### Text Improvement Endpoint

- **URL**: `/api/improve-text`
- **Methods**: POST, OPTIONS
- **Description**: Processes and improves text based on user preferences

**Request Body:**

```json
{
  "text": "Hello world, I hope you are doing well.",
  "style": "formal",
  "platform": "email",
  "language": "en",
  "customLanguage": "British English",
  "extraPrompt": "make it more professional"
}
```

**Response:**

```json
{
  "originalText": "Hello world, I hope you are doing well.",
  "improvedText": "[FORMAL VERSION - British English - Email]\n\nHello world, I hope you are doing well.\n\n[Note: make it more professional]",
  "style": "formal",
  "platform": "email",
  "language": "en",
  "customLanguage": "British English",
  "extraPrompt": "make it more professional",
  "timestamp": "2024-01-15T10:30:00Z",
  "processingTime": "2.5ms"
}
```

### Health Check

- **URL**: `/health`
- **Methods**: GET
- **Description**: Returns server health status

**Example Response:**

```json
{
  "status": "healthy",
  "service": "textcraft-api",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Testing

You can test the endpoints using curl:

```bash
# Test text improvement endpoint
curl -X POST http://localhost:8080/api/improve-text \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world, I hope you are doing well.","style":"formal","platform":"email","language":"en"}'

# Test text improvement with extra prompt
curl -X POST http://localhost:8080/api/improve-text \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a test message","style":"friendly","platform":"slack","language":"en","extraPrompt":"make it shorter"}'

# Test health check
curl http://localhost:8080/health
```

Or use the provided test script:

```bash
./test-api.sh
```

## Development

To build the application:

```bash
go build -o textcraft-api main.go
./textcraft-api
```

## Future Enhancements

This is currently a basic text improvement API. Future versions will include:

- AI-powered text processing with OpenAI/Claude integration
- Authentication and user management
- Database integration for saving improvements
- Advanced language processing
- Multiple output format support
- Batch processing capabilities
