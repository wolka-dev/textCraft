import { PenTool, Sparkles } from 'lucide-react';

export const Header = () => {
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
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">Ready</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};