#!/bin/bash

# Test script for Phrasing Craft API

echo "🧪 Testing Phrasing Craft API"
echo "=============================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test health endpoint
echo -e "\n${YELLOW}1. Testing health endpoint...${NC}"
if curl -s http://localhost:8080/health > /dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    curl -s http://localhost:8080/health | jq .
else
    echo -e "${RED}❌ Health check failed - is the server running?${NC}"
    exit 1
fi

# Test text improvement endpoint
echo -e "\n${YELLOW}2. Testing text improvement endpoint...${NC}"
if curl -s -X POST http://localhost:8080/api/improve-text \
    -H "Content-Type: application/json" \
    -d '{"text":"Hello world, I hope you are doing well.","style":"formal","platform":"email","language":"en"}' > /dev/null; then
    echo -e "${GREEN}✅ Text improvement test passed${NC}"
    curl -s -X POST http://localhost:8080/api/improve-text \
        -H "Content-Type: application/json" \
        -d '{"text":"Hello world, I hope you are doing well.","style":"formal","platform":"email","language":"en"}' | jq .
else
    echo -e "${RED}❌ Text improvement test failed${NC}"
fi

# Test text improvement with extra prompt
echo -e "\n${YELLOW}3. Testing text improvement with extra prompt...${NC}"
if curl -s -X POST http://localhost:8080/api/improve-text \
    -H "Content-Type: application/json" \
    -d '{"text":"This is a test message","style":"friendly","platform":"slack","language":"en","extraPrompt":"make it shorter"}' > /dev/null; then
    echo -e "${GREEN}✅ Text improvement with extra prompt test passed${NC}"
    curl -s -X POST http://localhost:8080/api/improve-text \
        -H "Content-Type: application/json" \
        -d '{"text":"This is a test message","style":"friendly","platform":"slack","language":"en","extraPrompt":"make it shorter"}' | jq .
else
    echo -e "${RED}❌ Text improvement with extra prompt test failed${NC}"
fi

echo -e "\n${GREEN}🎉 API testing completed!${NC}"
echo "If all tests passed, your backend is ready for frontend integration."
