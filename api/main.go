package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/mux"
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
	w.Header().Set("Content-Type", "application/json")

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

// processText simulates text improvement (replace with actual processing)
func processText(request TextImprovementRequest) string {
	// Get language display name
	language := request.CustomLanguage
	if language == "" {
		switch request.Language {
		case "en":
			language = "English"
		case "es":
			language = "Spanish"
		case "fr":
			language = "French"
		case "de":
			language = "German"
		case "it":
			language = "Italian"
		case "pt":
			language = "Portuguese"
		case "tr":
			language = "Turkish"
		default:
			language = "English"
		}
	}

	// Get platform display name
	platform := request.Platform
	switch platform {
	case "email":
		platform = "Email"
	case "slack":
		platform = "Slack"
	case "document":
		platform = "Document"
	case "social":
		platform = "Social Media"
	default:
		platform = "General"
	}

	// Get style display name
	style := request.Style
	switch style {
	case "typo-grammar":
		style = "Typo/Grammar Fix"
	case "formal":
		style = "Formal"
	case "friendly":
		style = "Friendly"
	case "casual":
		style = "Casual"
	case "professional":
		style = "Professional"
	default:
		style = "General"
	}

	// Create improved text (this is a placeholder - replace with actual AI processing)
	improvedText := fmt.Sprintf("[%s VERSION - %s - %s]\n\n%s",
		strings.ToUpper(style), language, platform, request.Text)

	// Add extra prompt if provided
	if request.ExtraPrompt != "" {
		improvedText += fmt.Sprintf("\n\n[Note: %s]", request.ExtraPrompt)
	}

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
		w.Header().Set("Content-Type", "application/json")
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
