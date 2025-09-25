import { Header } from '@/components/Header';
import { TextImprover } from '@/components/TextImprover';
import { Card } from '@/components/ui/card';
import { CheckCircle, Sparkles, Zap, Brain, Clock, Shield, ExternalLink } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      {/* Main Tool - First Priority */}
      <section className="container mx-auto px-4 py-4 sm:py-8">        
        <TextImprover />
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>© 2025</span>
            <a 
              href="https://wolka.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">W</span>
              </div>
              wolka.dev
            </a>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <a 
                href="https://groq.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">G</span>
                </div>
                <span className="font-semibold">Groq</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
