import { Header } from '@/components/Header';
import { TextImprover } from '@/components/TextImprover';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-image.jpg';
import { ArrowRight, CheckCircle, Globe, Sparkles, Zap, Brain, Languages, Clock, Shield, Users, Target } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      {/* Main Tool - First Priority */}
      <section className="container mx-auto px-4 py-8">        
        <TextImprover />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything you need to{' '}
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              perfect your writing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform combines cutting-edge technology with intuitive design 
            to transform your text into compelling, professional content.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Smart Enhancement */}
          <Card className="group p-8 bg-gradient-card shadow-soft border-0 text-center hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-4">Smart Enhancement</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Advanced AI that understands context, tone, and intent to deliver perfectly tailored improvements for any writing style.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Context-aware processing
            </div>
          </Card>
          
          {/* Instant Results */}
          <Card className="group p-8 bg-gradient-card shadow-soft border-0 text-center hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-4">Lightning Fast</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Get professional-quality improvements in seconds, not minutes. Our optimized AI delivers results instantly.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              Sub-second processing
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="group p-8 bg-gradient-card shadow-soft border-0 text-center hover:shadow-large transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-4">Privacy First</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your content is processed securely with enterprise-grade encryption. We never store or share your personal data.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              End-to-end encryption
            </div>
          </Card>

        </div>

      </section>
    </div>
  );
};

export default Index;
