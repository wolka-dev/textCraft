// API service for communicating with the backend
const API_BASE_URL = "http://textcraft-api:38080";

export interface TextImprovementRequest {
  text: string;
  style: string;
  platform: string;
  language: string;
  customLanguage?: string;
  extraPrompt?: string;
}

export interface TextImprovementResponse {
  originalText: string;
  improvedText: string;
  style: string;
  platform: string;
  language: string;
  customLanguage?: string;
  extraPrompt?: string;
  timestamp: string;
  processingTime: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

class ApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async improveText(
    request: TextImprovementRequest
  ): Promise<TextImprovementResponse> {
    const body = JSON.stringify(request);

    return this.makeRequest<TextImprovementResponse>("/api/improve-text", {
      method: "POST",
      body,
    });
  }

  async checkHealth(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>("/health");
  }

  // Test method to verify backend connectivity
  async testConnection(): Promise<boolean> {
    try {
      await this.checkHealth();
      return true;
    } catch (error) {
      console.error("Backend connection test failed:", error);
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
