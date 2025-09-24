# CI/CD Pipeline Setup Guide

## 🚀 Overview

This guide explains how to set up a complete CI/CD pipeline for your TextCraft application using GitHub Actions and Docker.

## 📋 Prerequisites

### 1. Docker Registry

You need a Docker registry to store your images. Options:

- **Docker Hub** (free for public repos)
- **GitHub Container Registry** (free for public repos)
- **AWS ECR**, **Google GCR**, **Azure ACR** (cloud providers)
- **Private registry** (self-hosted)

### 2. Server Requirements

- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **Docker**: Latest version installed
- **Docker Compose**: Latest version installed
- **SSH Access**: Key-based authentication configured
- **Ports**: 3000 (UI) and 8080 (API) open

### 3. GitHub Repository

- Repository with your TextCraft code
- GitHub Actions enabled

## 🔧 Setup Instructions

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### **Docker Registry Secrets**

```
REGISTRY_URL=your-registry.com
REGISTRY_USERNAME=your-username
REGISTRY_PASSWORD=your-password
```

#### **Server Access Secrets**

```
SSH_HOST=your-server-ip-or-domain
SSH_USER=your-username
SSH_PRIVATE_KEY=your-private-ssh-key
```

#### **Application Secrets**

```
GROQ_API_KEY=your-groq-api-key
```

### Step 2: Server Preparation

#### **Install Docker and Docker Compose**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login to apply docker group changes
```

#### **Configure SSH Key Authentication**

```bash
# On your local machine, generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key to server
ssh-copy-id username@your-server-ip

# Test SSH connection
ssh username@your-server-ip
```

#### **Create Application Directory**

```bash
sudo mkdir -p /opt/textcraft
sudo chown $USER:$USER /opt/textcraft
```

### Step 3: Configure Firewall (if needed)

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 22    # SSH
sudo ufw allow 3000  # UI
sudo ufw allow 8080  # API
sudo ufw enable
```

## 🔄 How the Pipeline Works

### **1. Pull Request Workflow**

- Runs tests on both frontend and backend
- Validates code quality
- Builds images (but doesn't deploy)

### **2. Master/Main Branch Workflow**

- Runs all tests
- Builds and pushes Docker images
- Deploys to production server
- Performs health checks

### **3. Deployment Process**

1. **Build**: Creates optimized Docker images
2. **Push**: Uploads images to registry
3. **Deploy**: Pulls images on server and starts containers
4. **Health Check**: Verifies services are running
5. **Cleanup**: Removes old images

## 📁 File Structure

```
textcraft/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── docker-compose.prod.yml     # Production compose file
├── deploy.sh                   # Manual deployment script
└── CI_CD_SETUP.md             # This guide
```

## 🛠️ Manual Deployment

If you need to deploy manually:

```bash
# Set environment variables
export REGISTRY_URL="your-registry.com"
export GROQ_API_KEY="your-groq-api-key"
export IMAGE_TAG="latest"

# Run deployment script
./deploy.sh production
```

## 🔍 Monitoring and Troubleshooting

### **Check Container Status**

```bash
cd /opt/textcraft
docker-compose -f docker-compose.prod.yml ps
```

### **View Logs**

```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs ui
```

### **Health Checks**

```bash
# API health
curl http://localhost:8080/health

# UI health
curl http://localhost:3000
```

### **Restart Services**

```bash
cd /opt/textcraft
docker-compose -f docker-compose.prod.yml restart
```

## 🚨 Common Issues

### **1. SSH Connection Failed**

- Verify SSH key is correctly added to GitHub secrets
- Check server SSH configuration
- Ensure firewall allows SSH (port 22)

### **2. Docker Registry Authentication Failed**

- Verify registry credentials in GitHub secrets
- Check if registry URL is correct
- Ensure registry allows the authentication method

### **3. Health Check Failed**

- Check if ports 3000 and 8080 are open
- Verify GROQ_API_KEY is set correctly
- Check container logs for errors

### **4. Out of Disk Space**

- Clean up old Docker images: `docker image prune -a`
- Remove unused containers: `docker container prune`
- Check disk usage: `df -h`

## 🔒 Security Best Practices

### **1. Secrets Management**

- Never commit secrets to code
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly

### **2. Server Security**

- Use SSH key authentication only
- Disable password authentication
- Keep system updated
- Use firewall to restrict access

### **3. Container Security**

- Run containers as non-root user
- Use specific image tags (not `latest` in production)
- Regularly update base images
- Scan images for vulnerabilities

## 📊 Pipeline Features

### **✅ Automated Testing**

- Go unit tests
- Frontend linting and build validation
- Docker image building

### **✅ Multi-Stage Deployment**

- Separate build and deploy stages
- Health checks after deployment
- Rollback capability

### **✅ Caching**

- Docker layer caching for faster builds
- Node.js dependency caching
- Go module caching

### **✅ Notifications**

- Deployment status notifications
- Error reporting
- Success confirmations

## 🎯 Next Steps

1. **Set up your Docker registry**
2. **Configure GitHub secrets**
3. **Prepare your server**
4. **Push code to trigger the pipeline**
5. **Monitor the deployment**

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Review server logs
3. Verify all secrets are correctly set
4. Ensure server meets requirements

---

**Ready to deploy?** Push your code to the master branch and watch the magic happen! 🚀
