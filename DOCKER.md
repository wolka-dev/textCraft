# Docker Setup for Phrasing Craft

This document explains how to run the Phrasing Craft application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### Production Mode

To run the application in production mode:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

### Development Mode

To run the application in development mode with hot reloading:

```bash
# Build and start all services in development mode
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up --build -d
```

## Services

### API Service (Backend)

- **Port**: 8080
- **Health Check**: http://localhost:8080/health
- **Technology**: Go with Gorilla Mux
- **Endpoints**:
  - `POST /api/improve-text` - Text improvement endpoint
  - `GET /health` - Health check endpoint

### UI Service (Frontend)

- **Port**: 3000 (production: 80)
- **Health Check**: http://localhost:3000/health
- **Technology**: React with Vite
- **Features**: Modern UI with Tailwind CSS and shadcn/ui components

## Docker Commands

### Basic Commands

```bash
# Start services
docker-compose up

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs api
docker-compose logs ui

# Follow logs in real-time
docker-compose logs -f
```

### Build Commands

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api
docker-compose build ui

# Force rebuild without cache
docker-compose build --no-cache
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Rebuild specific service in development
docker-compose -f docker-compose.dev.yml build api

# View development logs
docker-compose -f docker-compose.dev.yml logs -f ui
```

## Health Checks

Both services include health checks:

- **API Health Check**: Checks if the Go server is responding
- **UI Health Check**: Checks if the nginx server is responding

You can check service health with:

```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs api
docker-compose logs ui
```

## Environment Variables

### API Service

- `PORT`: Server port (default: 8080)
- `GO_ENV`: Go environment (development/production)

### UI Service

- `VITE_API_URL`: Backend API URL (default: http://localhost:8080)

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :8080

   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Build Failures**

   ```bash
   # Clean build
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

3. **Permission Issues**

   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

4. **Network Issues**
   ```bash
   # Reset Docker networks
   docker network prune
   docker-compose up --build
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs api
docker-compose logs ui

# Follow logs in real-time
docker-compose logs -f api

# Check service status
docker-compose ps

# Inspect service
docker-compose exec api sh
docker-compose exec ui sh
```

## Production Deployment

For production deployment:

1. **Build production images**:

   ```bash
   docker-compose build
   ```

2. **Run with production settings**:

   ```bash
   docker-compose up -d
   ```

3. **Set up reverse proxy** (recommended):

   - Use nginx or traefik as reverse proxy
   - Configure SSL certificates
   - Set up proper domain names

4. **Environment variables**:
   - Set production environment variables
   - Configure proper API URLs
   - Set up monitoring and logging

## File Structure

```
phrasing-craft/
├── docker-compose.yml          # Production compose file
├── docker-compose.dev.yml      # Development compose file
├── api/
│   ├── Dockerfile              # API production image
│   └── .dockerignore           # API docker ignore
├── ui/
│   ├── Dockerfile              # UI production image
│   ├── Dockerfile.dev          # UI development image
│   ├── nginx.conf              # Nginx configuration
│   └── .dockerignore           # UI docker ignore
└── DOCKER.md                   # This file
```

## Security Notes

- Both containers run as non-root users
- Security headers are configured in nginx
- CORS is properly configured in the API
- Health checks are implemented for monitoring

## Performance Notes

- Multi-stage builds for smaller production images
- Gzip compression enabled in nginx
- Static asset caching configured
- Alpine Linux base images for minimal size
