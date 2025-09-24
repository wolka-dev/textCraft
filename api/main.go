package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/mux"
)

// Constants
const (
	ContentTypeJSON   = "application/json"
	ContentTypeHeader = "Content-Type"
	MaxWords          = 200
	ThrottleDuration  = 5 * time.Second
)

// TextImprovementRequest represents the incoming request
type TextImprovementRequest struct {
	Text           string `json:"text"`
	Style          string `json:"style"`
	Platform       string `json:"platform"`
	Language       string `json:"language"`
	CustomLanguage string `json:"customLanguage,omitempty"`
	ExtraPrompt    string `json:"extraPrompt,omitempty"`
}

// TextImprovementResponse represents the response structure
type TextImprovementResponse struct {
	OriginalText   string `json:"originalText"`
	ImprovedText   string `json:"improvedText"`
	Style          string `json:"style"`
	Platform       string `json:"platform"`
	Language       string `json:"language"`
	CustomLanguage string `json:"customLanguage,omitempty"`
	ExtraPrompt    string `json:"extraPrompt,omitempty"`
	Timestamp      string `json:"timestamp"`
	ProcessingTime string `json:"processingTime"`
}

// GroqRequest represents the request format for Groq API
type GroqRequest struct {
	Messages []GroqMessage `json:"messages"`
	Model    string        `json:"model"`
	Stream   bool          `json:"stream"`
}

type GroqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GroqResponse struct {
	Choices []GroqChoice `json:"choices"`
}

type GroqChoice struct {
	Message GroqMessage `json:"message"`
}

// RateLimiter represents a simple rate limiter
type RateLimiter struct {
	lastRequest time.Time
	mutex       sync.RWMutex
}

// Global rate limiter instance
var rateLimiter = &RateLimiter{}

// IsAllowed checks if a request is allowed based on rate limiting
func (rl *RateLimiter) IsAllowed() bool {
	rl.mutex.Lock()
	defer rl.mutex.Unlock()

	now := time.Now()
	if now.Sub(rl.lastRequest) >= ThrottleDuration {
		rl.lastRequest = now
		return true
	}
	return false
}

// GetTimeUntilNextRequest returns the time until the next request is allowed
func (rl *RateLimiter) GetTimeUntilNextRequest() time.Duration {
	rl.mutex.RLock()
	defer rl.mutex.RUnlock()

	now := time.Now()
	timeSinceLastRequest := now.Sub(rl.lastRequest)
	if timeSinceLastRequest >= ThrottleDuration {
		return 0
	}
	return ThrottleDuration - timeSinceLastRequest
}

// countWords counts the number of words in a text
func countWords(text string) int {
	words := strings.Fields(strings.TrimSpace(text))
	return len(words)
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Text improvement endpoint that processes and improves text
func improveTextHandler(w http.ResponseWriter, r *http.Request) {
	// Set content type
	w.Header().Set(ContentTypeHeader, ContentTypeJSON)

	// Parse request body
	var request TextImprovementRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if request.Text == "" {
		http.Error(w, "Text field is required", http.StatusBadRequest)
		return
	}

	if request.Style == "" {
		http.Error(w, "Style field is required", http.StatusBadRequest)
		return
	}

	// Check rate limiting
	if !rateLimiter.IsAllowed() {
		timeUntilNext := rateLimiter.GetTimeUntilNextRequest()
		w.Header().Set("Retry-After", fmt.Sprintf("%.0f", timeUntilNext.Seconds()))
		http.Error(w, fmt.Sprintf("Rate limit exceeded. Please wait %.1f seconds before making another request.", timeUntilNext.Seconds()), http.StatusTooManyRequests)
		return
	}

	// Check word limit
	wordCount := countWords(request.Text)
	if wordCount > MaxWords {
		http.Error(w, fmt.Sprintf("Text exceeds word limit. Maximum allowed: %d words, provided: %d words", MaxWords, wordCount), http.StatusBadRequest)
		return
	}

	// Start timing
	startTime := time.Now()

	// Simulate text processing (replace with actual AI/ML processing later)
	improvedText := processText(request)

	// Calculate processing time
	processingTime := time.Since(startTime)

	// Create response
	response := TextImprovementResponse{
		OriginalText:   request.Text,
		ImprovedText:   improvedText,
		Style:          request.Style,
		Platform:       request.Platform,
		Language:       request.Language,
		CustomLanguage: request.CustomLanguage,
		ExtraPrompt:    request.ExtraPrompt,
		Timestamp:      time.Now().Format(time.RFC3339),
		ProcessingTime: processingTime.String(),
	}

	// Send JSON response
	json.NewEncoder(w).Encode(response)
}

// processText processes text using Groq AI with fallback
func processText(request TextImprovementRequest) string {
	// Try Groq first
	if improvedText, err := processWithGroq(request); err == nil {
		return improvedText
	}

	// Fallback to enhanced local processing
	return processTextFallback(request)
}

// processWithGroq processes text using Groq API
func processWithGroq(request TextImprovementRequest) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GROQ_API_KEY not set")
	}

	prompt := buildPrompt(request)

	groqReq := GroqRequest{
		Messages: []GroqMessage{
			{
				Role:    "system",
				Content: "You are a professional text improvement assistant. Improve the given text according to the specified style, platform, and language requirements. Provide only the improved text without any explanations or formatting.",
			},
			{
				Role:    "user",
				Content: prompt,
			},
		},
		Model:  "llama-3.1-8b-instant", // Fast model
		Stream: false,
	}

	jsonData, err := json.Marshal(groqReq)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set(ContentTypeHeader, ContentTypeJSON)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("groq API error: %s", string(body))
	}

	var groqResp GroqResponse
	if err := json.NewDecoder(resp.Body).Decode(&groqResp); err != nil {
		return "", err
	}

	if len(groqResp.Choices) == 0 {
		return "", fmt.Errorf("no response from Groq")
	}

	return strings.TrimSpace(groqResp.Choices[0].Message.Content), nil
}

// buildPrompt creates a prompt for AI models
func buildPrompt(request TextImprovementRequest) string {
	language := getLanguageName(request.Language, request.CustomLanguage)
	platform := getPlatformName(request.Platform)
	style := getStyleName(request.Style)

	prompt := fmt.Sprintf(`Improve the following text for %s platform in %s language. Style: %s.

Original text: "%s"`, platform, language, style, request.Text)

	if request.ExtraPrompt != "" {
		prompt += fmt.Sprintf("\n\nAdditional instructions: %s", request.ExtraPrompt)
	}

	prompt += "\n\nProvide only the improved text without any explanations or formatting."
	return prompt
}

// Helper functions for language, platform, and style mapping
func getLanguageName(langCode, customLang string) string {
	if customLang != "" {
		return customLang
	}

	switch langCode {
	case "en":
		return "English"
	case "es":
		return "Spanish"
	case "fr":
		return "French"
	case "de":
		return "German"
	case "it":
		return "Italian"
	case "pt":
		return "Portuguese"
	case "tr":
		return "Turkish"
	default:
		return "English"
	}
}

func getPlatformName(platform string) string {
	switch platform {
	case "email":
		return "Email"
	case "slack":
		return "Slack"
	case "document":
		return "Document"
	case "social":
		return "Social Media"
	default:
		return "General"
	}
}

func getStyleName(style string) string {
	switch style {
	case "typo-grammar":
		return "Fix typos and grammar errors"
	case "formal":
		return "Make it formal and professional"
	case "friendly":
		return "Make it friendly and warm"
	case "casual":
		return "Make it casual and conversational"
	case "professional":
		return "Make it professional and business-focused"
	default:
		return "Improve the text"
	}
}

// processTextFallback provides enhanced fallback when AI services are unavailable
func processTextFallback(request TextImprovementRequest) string {
	language := getLanguageName(request.Language, request.CustomLanguage)
	platform := getPlatformName(request.Platform)
	style := getStyleName(request.Style)

	// Basic text improvements
	improvedText := request.Text

	// Fix common typos and grammar
	improvedText = strings.ReplaceAll(improvedText, " i ", " I ")
	improvedText = strings.ReplaceAll(improvedText, " dont ", " don't ")
	improvedText = strings.ReplaceAll(improvedText, " cant ", " can't ")
	improvedText = strings.ReplaceAll(improvedText, " wont ", " won't ")
	improvedText = strings.ReplaceAll(improvedText, " its ", " it's ")

	// Capitalize first letter
	if len(improvedText) > 0 {
		improvedText = strings.ToUpper(string(improvedText[0])) + improvedText[1:]
	}

	// Add context based on style
	prefix := fmt.Sprintf("[%s VERSION - %s - %s]\n\n", strings.ToUpper(style), language, platform)
	improvedText = prefix + improvedText

	// Add extra prompt if provided
	if request.ExtraPrompt != "" {
		improvedText += fmt.Sprintf("\n\n[Note: %s]", request.ExtraPrompt)
	}

	improvedText += "\n\n[Note: This is a fallback response. For better results, set GROQ_API_KEY environment variable.]"

	return improvedText
}

func main() {
	// Create router
	r := mux.NewRouter()

	// Add CORS middleware
	r.Use(corsMiddleware)

	// Define routes
	r.HandleFunc("/api/improve-text", improveTextHandler).Methods("POST", "OPTIONS")

	// Health check endpoint
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set(ContentTypeHeader, ContentTypeJSON)
		json.NewEncoder(w).Encode(map[string]string{
			"status":    "healthy",
			"service":   "phrasing-craft-api",
			"timestamp": time.Now().Format(time.RFC3339),
		})
	}).Methods("GET", "OPTIONS")

	// Catch-all OPTIONS handler for CORS preflight
	r.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Start server
	port := "8080"
	fmt.Printf("🚀 Starting Phrasing Craft API server on port %s\n", port)
	fmt.Printf("📝 Text improvement endpoint: http://localhost:%s/api/improve-text\n", port)
	fmt.Printf("🏥 Health check: http://localhost:%s/health\n", port)

	log.Fatal(http.ListenAndServe(":"+port, r))
}
