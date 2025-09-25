import { PenTool, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export const Header = () => {
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await apiService.testConnection();
        setBackendConnected(connected);
      } catch (error) {
        setBackendConnected(false);
        console.error('Backend connection error:', error);
      }
    };

    checkConnection();
  }, []);
  return (
    <header className="w-full bg-gradient-background border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-primary rounded-md shadow-soft">
              <PenTool className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-1.5">
                <span className="hidden xs:inline">TextCraft</span>
                <span className="xs:hidden">TC</span>
                <Sparkles className="h-4 w-4 text-primary" />
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI-powered text enhancement</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {backendConnected === null && (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Checking connection...</span>
                <span className="sm:hidden">Checking...</span>
              </span>
            )}
            {backendConnected === true && (
              <span className="flex items-center gap-1 text-green-600">
                <Check className="h-3 w-3" />
                <span className="hidden sm:inline">Backend connected</span>
                <span className="sm:hidden">Connected</span>
              </span>
            )}
            {backendConnected === false && (
              <span className="flex items-center gap-1 text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span className="hidden sm:inline">Backend offline</span>
                <span className="sm:hidden">Offline</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};