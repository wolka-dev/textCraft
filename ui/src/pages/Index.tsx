import { Header } from '@/components/Header';
import { TextImprover } from '@/components/TextImprover';
import { Card } from '@/components/ui/card';
import { CheckCircle, Sparkles, Zap, Brain, Clock, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      {/* Main Tool - First Priority */}
      <section className="container mx-auto px-4 py-4 sm:py-8">        
        <TextImprover />
      </section>
    </div>
  );
};

export default Index;
