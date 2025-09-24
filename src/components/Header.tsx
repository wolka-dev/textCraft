import { PenTool, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full bg-gradient-background border-b border-border/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-soft">
              <PenTool className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                TextCraft
                <Sparkles className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">Transform your writing with AI</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Ready to enhance your text
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};