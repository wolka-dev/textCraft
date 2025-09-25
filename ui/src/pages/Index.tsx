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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8 sm:py-16">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            Powerful Features
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Everything you need to{' '}
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              perfect your writing
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Our AI-powered platform combines cutting-edge technology with intuitive design 
            to transform your text into compelling, professional content.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Smart Enhancement */}
          <Card className="group p-4 sm:p-6 lg:p-8 bg-gradient-card shadow-soft border-0 text-center hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Smart Enhancement</h4>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              Advanced AI that understands context, tone, and intent to deliver perfectly tailored improvements for any writing style.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary text-xs sm:text-sm font-medium">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              Context-aware processing
            </div>
          </Card>
          
          {/* Instant Results */}
          <Card className="group p-4 sm:p-6 lg:p-8 bg-gradient-card shadow-soft border-0 text-center hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Lightning Fast</h4>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              Get professional-quality improvements in seconds, not minutes. Our optimized AI delivers results instantly.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary text-xs sm:text-sm font-medium">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              Sub-second processing
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="group p-4 sm:p-6 lg:p-8 bg-gradient-card shadow-soft border-0 text-center hover:shadow-large transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Privacy First</h4>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              Your content is processed securely with enterprise-grade encryption. We never store or share your personal data.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary text-xs sm:text-sm font-medium">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              End-to-end encryption
            </div>
          </Card>

        </div>

      </section>
    </div>
  );
};

export default Index;
