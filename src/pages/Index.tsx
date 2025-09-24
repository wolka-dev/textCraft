import { Header } from '@/components/Header';
import { TextImprover } from '@/components/TextImprover';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-image.jpg';
import { ArrowRight, CheckCircle, Globe, Sparkles, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Transform Your Writing
                <span className="block text-primary">With AI Precision</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Perfect your emails, messages, and documents with intelligent text enhancement. 
                Choose your style, language, and let AI craft the perfect version.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="h-4 w-4" />
                Multiple writing styles
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Globe className="h-4 w-4" />
                Multi-language support
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4" />
                Instant results
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 rounded-full"></div>
            <img 
              src={heroImage} 
              alt="Text transformation illustration" 
              className="relative z-10 w-full h-auto rounded-2xl shadow-large"
            />
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Start Improving Your Text
          </h3>
          <p className="text-muted-foreground">
            Enter your text, choose your style, and watch the magic happen
          </p>
        </div>
        
        <TextImprover />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-card shadow-soft border-0 text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Smart Enhancement</h4>
            <p className="text-muted-foreground">
              AI-powered text improvement that understands context and tone
            </p>
          </Card>
          
          <Card className="p-6 bg-gradient-card shadow-soft border-0 text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Multi-Language</h4>
            <p className="text-muted-foreground">
              Support for multiple languages to reach global audiences
            </p>
          </Card>
          
          <Card className="p-6 bg-gradient-card shadow-soft border-0 text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Instant Results</h4>
            <p className="text-muted-foreground">
              Get improved text in seconds, ready to copy and use
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
