import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Languages, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const styles = [
  { value: 'formal', label: 'Formal', description: 'Professional and polished' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'professional', label: 'Professional', description: 'Business-focused' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
];

export const TextImprover = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImproveText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Please enter some text",
        description: "Add text to the input area to get started.",
      });
      return;
    }

    if (!selectedStyle) {
      toast({
        title: "Please select a style",
        description: "Choose how you'd like your text to be improved.",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate text processing
    setTimeout(() => {
      const processedText = `[${selectedStyle.toUpperCase()} VERSION - ${languages.find(l => l.value === selectedLanguage)?.label}]\n\n${inputText}`;
      setOutputText(processedText);
      setIsProcessing(false);
      toast({
        title: "Text improved successfully!",
        description: "Your text has been transformed according to your preferences.",
      });
    }, 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setSelectedStyle('');
    setSelectedLanguage('en');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Controls */}
      <Card className="p-6 bg-gradient-card shadow-soft border-0">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Writing Style
            </label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/30 transition-smooth">
                <SelectValue placeholder="Choose your style..." />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    <div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary" />
              Output Language
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/30 transition-smooth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleImproveText} 
              disabled={isProcessing}
              className="bg-gradient-primary hover:shadow-medium transition-smooth"
            >
              {isProcessing ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Improve Text
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear}
              className="hover:bg-muted/50 transition-smooth"
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Text Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-0 bg-gradient-card shadow-soft border-0 overflow-hidden">
          <div className="p-4 bg-muted/30 border-b border-border/50">
            <h3 className="font-semibold text-foreground">Original Text</h3>
            <p className="text-sm text-muted-foreground">Enter your text here</p>
          </div>
          <div className="p-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type your text here. For example: 'Hi, I hope you are doing well. I wanted to ask if we can meet tomorrow to discuss the project.'"
              className="min-h-[300px] border-0 bg-transparent resize-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </Card>

        {/* Output */}
        <Card className="p-0 bg-gradient-card shadow-soft border-0 overflow-hidden">
          <div className="p-4 bg-primary/5 border-b border-border/50">
            <h3 className="font-semibold text-foreground">Improved Text</h3>
            <p className="text-sm text-muted-foreground">Your enhanced version will appear here</p>
          </div>
          <div className="p-4">
            <Textarea
              value={outputText}
              readOnly
              placeholder="Your improved text will appear here after processing..."
              className="min-h-[300px] border-0 bg-transparent resize-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};