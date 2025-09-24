# 🔐 GitHub Secrets Setup Guide

## 🚨 **Current Issue**

Your GitHub Actions workflow is failing because the required secrets are not configured. The workflow will now run successfully even without secrets, but to enable full functionality (Docker registry push and server deployment), you need to set up the following secrets.

## 📋 **Required Secrets**

### **For Docker Registry Push (Optional)**
These secrets enable pushing Docker images to a registry:

- **`REGISTRY_URL`** - Your Docker registry URL
  - Examples: `docker.io/yourusername`, `ghcr.io/yourusername`, `your-registry.com`
- **`REGISTRY_USERNAME`** - Registry username
- **`REGISTRY_PASSWORD`** - Registry password/token

### **For Server Deployment (Optional)**
These secrets enable automatic deployment to your server:

- **`SSH_HOST`** - Your server IP address or domain
  - Example: `192.168.1.100` or `your-server.com`
- **`SSH_USER`** - SSH username for your server
  - Example: `ubuntu`, `root`, `deploy`
- **`SSH_PRIVATE_KEY`** - SSH private key for authentication
- **`GROQ_API_KEY`** - Your Groq API key for the application

## 🛠️ **How to Set Up Secrets**

### **Step 1: Go to Repository Settings**
1. Go to your GitHub repository: `https://github.com/wolka-dev/textCraft`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### **Step 2: Add Secrets**
1. Click **New repository secret**
2. Enter the secret name (e.g., `REGISTRY_URL`)
3. Enter the secret value
4. Click **Add secret**
5. Repeat for all required secrets

## 🐳 **Docker Registry Options**

### **Option 1: Docker Hub (Free)**
```bash
REGISTRY_URL=docker.io/yourusername
REGISTRY_USERNAME=yourusername
REGISTRY_PASSWORD=your-docker-hub-password
```

### **Option 2: GitHub Container Registry (Free)**
```bash
REGISTRY_URL=ghcr.io/wolka-dev
REGISTRY_USERNAME=wolka-dev
REGISTRY_PASSWORD=ghp_your_github_token
```

### **Option 3: Private Registry**
```bash
REGISTRY_URL=your-registry.com
REGISTRY_USERNAME=your-username
REGISTRY_PASSWORD=your-password
```

## 🖥️ **Server Setup**

### **SSH Key Generation**
If you don't have SSH keys set up:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key to server
ssh-copy-id username@your-server-ip

# Copy private key content for SSH_PRIVATE_KEY secret
cat ~/.ssh/id_ed25519
```

### **Server Requirements**
Your server needs:
- Docker and Docker Compose installed
- SSH access configured
- Ports 3000 and 8080 open

## 🎯 **Current Workflow Behavior**

### **Without Secrets (Current State)**
- ✅ **build-test**: Runs tests and builds
- ✅ **build-and-push**: Builds Docker images locally (no push)
- ⚠️ **deploy**: Skipped (no SSH secrets)
- ✅ **notify**: Shows configuration status

### **With Registry Secrets Only**
- ✅ **build-test**: Runs tests and builds
- ✅ **build-and-push**: Builds and pushes Docker images
- ⚠️ **deploy**: Skipped (no SSH secrets)
- ✅ **notify**: Shows registry push success

### **With All Secrets**
- ✅ **build-test**: Runs tests and builds
- ✅ **build-and-push**: Builds and pushes Docker images
- ✅ **deploy**: Deploys to server
- ✅ **notify**: Shows full deployment success

## 🚀 **Quick Start**

### **Minimal Setup (Testing Only)**
No secrets needed - workflow will run and build images locally.

### **Full Setup (Production)**
1. Set up Docker Hub or GitHub Container Registry
2. Configure server with Docker
3. Add all required secrets
4. Push to main branch to trigger deployment

## 📞 **Need Help?**

1. **Docker Registry**: Choose Docker Hub for simplicity
2. **Server Setup**: Use a VPS like DigitalOcean, AWS, or Linode
3. **SSH Keys**: Follow your server provider's documentation
4. **Groq API**: Get your API key from [console.groq.com](https://console.groq.com)

---

**🎉 Once secrets are configured, your workflow will automatically build, push, and deploy your TextCraft application!**
