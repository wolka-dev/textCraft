import { PenTool, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full bg-gradient-background border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-primary rounded-md shadow-soft">
              <PenTool className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-1.5">
                TextCraft
                <Sparkles className="h-4 w-4 text-primary" />
              </h1>
              <p className="text-xs text-muted-foreground">AI-powered text enhancement</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              Ready
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};