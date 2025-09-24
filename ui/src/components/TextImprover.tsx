import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowRight, Sparkles, Languages, Wand2, Copy, RotateCcw, Check, Loader2, Zap, Target, MessageSquare, CheckCircle, Briefcase, Heart, Coffee, Building, Mail, MessageSquare as SlackIcon, FileText, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiService, TextImprovementRequest } from '@/services/api';

const styles = [
  { value: 'typo-grammar', label: 'Typo/Grammar', description: 'Fix errors and improve clarity', icon: CheckCircle },
  { value: 'formal', label: 'Formal', description: 'Professional and polished', icon: Briefcase },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable', icon: Heart },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational', icon: Coffee },
  { value: 'professional', label: 'Professional', description: 'Business-focused', icon: Building },
];

const platforms = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'slack', label: 'Slack', icon: SlackIcon },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'social', label: 'Social Media', icon: FileText },
];

const languages = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'it', label: 'Italian', flag: '🇮🇹' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'tr', label: 'Turkish', flag: '🇹🇷' },
];

export const TextImprover = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('typo-grammar');
  const [selectedPlatform, setSelectedPlatform] = useState('email');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customLanguage, setCustomLanguage] = useState('');
  const [extraPrompt, setExtraPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isOutputEdited, setIsOutputEdited] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await apiService.testConnection();
        setBackendConnected(connected);
        if (connected) {
          setConnectionError(null);
        } else {
          setConnectionError('Backend server is not running');
        }
      } catch (error) {
        setBackendConnected(false);
        setConnectionError('Failed to connect to backend server');
        console.error('Backend connection error:', error);
      }
    };

    checkConnection();
  }, []);

  // Update word count
  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [inputText]);

  const handleImproveText = useCallback(async () => {
    if (!inputText.trim()) {
      toast({
        title: "Please enter some text",
        description: "Add text to the input area to get started.",
      });
      inputRef.current?.focus();
      return;
    }

    if (!selectedStyle) {
      toast({
        title: "Please select a style",
        description: "Choose how you'd like your text to be improved.",
      });
      return;
    }

    if (!backendConnected) {
      toast({
        title: "Backend not available",
        description: connectionError || "Please ensure the backend server is running.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setConnectionError(null);
    
    try {
      const request: TextImprovementRequest = {
        text: inputText,
        style: selectedStyle,
        platform: selectedPlatform,
        language: selectedLanguage,
        customLanguage: customLanguage.trim() || undefined,
        extraPrompt: extraPrompt.trim() || undefined,
      };

      const response = await apiService.improveText(request);
      
      // Use the improved text from the backend response
      setOutputText(response.improvedText);
      setIsOutputEdited(false); // Reset edit state when new text is generated
      
      toast({
        title: "Text improved successfully!",
        description: "Your text has been sent to the backend and processed.",
      });
      
    } catch (error) {
      console.error('Error improving text:', error);
      setConnectionError('Failed to process text');
      toast({
        title: "Error processing text",
        description: "There was an error communicating with the backend. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, selectedStyle, selectedPlatform, customLanguage, selectedLanguage, extraPrompt, backendConnected, connectionError]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isProcessing && inputText.trim() && selectedStyle) {
          handleImproveText();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, inputText, selectedStyle, handleImproveText]);

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setSelectedStyle('typo-grammar');
    setSelectedPlatform('email');
    setSelectedLanguage('en');
    setCustomLanguage('');
    setExtraPrompt('');
    setCopied(false);
    setIsOutputEdited(false);
    inputRef.current?.focus();
  };

  const handleCopy = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The improved text has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwapText = () => {
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
      setIsOutputEdited(false);
      inputRef.current?.focus();
    }
  };

  const handleOutputTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputText(e.target.value);
    setIsOutputEdited(true);
  };

  // Get current selected language for display
  const currentLanguage = languages.find(l => l.value === selectedLanguage);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Controls */}
        <Card className="p-6 bg-gradient-card shadow-soft border-0">
          <div className="space-y-6">
            {/* Writing Style Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Writing Style
              </label>
              <div className="grid grid-cols-5 gap-3">
                {styles.map((style) => {
                  const IconComponent = style.icon;
                  return (
                    <Tooltip key={style.value}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedStyle(style.value)}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 cursor-pointer group ${
                            selectedStyle === style.value 
                              ? 'bg-primary/10 border-primary/50 shadow-sm' 
                              : 'bg-background/30 border-border/50 hover:border-primary/30 hover:bg-background/50'
                          }`}
                        >
                          <div className={`p-1 rounded transition-colors ${
                            selectedStyle === style.value 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                          }`}>
                            <IconComponent className="h-3 w-3" />
                          </div>
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors text-xs">{style.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{style.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Language and Instructions Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  Output Language
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select 
                      value={selectedLanguage} 
                      onValueChange={setSelectedLanguage}
                      disabled={!!customLanguage.trim()}
                    >
                      <SelectTrigger className={`flex-1 transition-smooth ${
                        customLanguage.trim() 
                          ? 'bg-muted/30 border-muted-foreground/30 opacity-50' 
                          : 'bg-background/50 border-border/50 hover:border-primary/30'
                      }`}>
                        <SelectValue>
                          {currentLanguage && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{currentLanguage.flag}</span>
                              <span>{currentLanguage.label}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{language.flag}</span>
                              <span>{language.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Input
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        placeholder="Or enter custom language..."
                        className={`transition-smooth ${
                          customLanguage.trim()
                            ? 'bg-primary/10 border-primary/50 shadow-sm'
                            : 'bg-background/50 border-border/50 hover:border-primary/30'
                        }`}
                      />
                      {customLanguage.trim() && (
                        <div className="absolute -top-1 -right-1">
                          <Badge variant="default" className="text-xs px-2 py-0.5 bg-primary text-primary-foreground">
                            Active
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  {customLanguage.trim() && (
                    <p className="text-xs text-primary flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Custom language "{customLanguage}" will be used
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                  Extra Instructions
                </label>
                <Input
                  value={extraPrompt}
                  onChange={(e) => setExtraPrompt(e.target.value)}
                  placeholder="Add specific instructions (e.g., 'make it shorter', 'add emojis')..."
                  className="bg-background/50 border-border/50 hover:border-primary/30 transition-smooth"
                />
              </div>
            </div>
             
            {/* Platform and Action Buttons Row */}
            <div className="flex items-center gap-4">
              {/* Platform Section */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2 whitespace-nowrap">
                  <Target className="h-4 w-4 text-primary" />
                  Platform:
                </label>
                <div className="flex gap-2">
                  {platforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <button
                        key={platform.value}
                        onClick={() => setSelectedPlatform(platform.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer group ${
                          selectedPlatform === platform.value 
                            ? 'bg-primary/10 border-primary/50 shadow-sm' 
                            : 'bg-background/30 border-border/50 hover:border-primary/30 hover:bg-background/50'
                        }`}
                      >
                        <div className={`p-1 rounded transition-colors ${
                          selectedPlatform === platform.value 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                        }`}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors text-xs">{platform.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Backend Status */}
              <div className="flex items-center gap-2">
                {backendConnected === null && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs">Checking connection...</span>
                  </div>
                )}
                {backendConnected === true && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="h-3 w-3" />
                    <span className="text-xs">Backend connected</span>
                  </div>
                )}
                {backendConnected === false && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs">Backend offline</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-auto">
                <Button 
                  onClick={handleImproveText} 
                  disabled={isProcessing || !inputText.trim() || !selectedStyle || !backendConnected}
                  className="bg-gradient-primary hover:shadow-medium transition-smooth"
                  size="default"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Improve Text
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="hover:bg-muted/50 transition-smooth"
                  disabled={isProcessing}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

          </div>
        </Card>

        {/* Text Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="p-0 bg-gradient-card shadow-soft border-0 overflow-hidden group">
            <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Original Text
                </h3>
              </div>
              {inputText && (
                <Badge variant="secondary" className="text-xs">
                  {wordCount} words
                </Badge>
              )}
            </div>
            <div className="p-4 relative">
              <Textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your text here. For example: 'Hi, I hope you are doing well. I wanted to ask if we can meet tomorrow to discuss the project.'"
                className="min-h-[300px] border-0 bg-transparent resize-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground transition-all duration-200"
                onFocus={(e) => e.target.style.transform = 'scale(1.01)'}
                onBlur={(e) => e.target.style.transform = 'scale(1)'}
              />
              {!inputText && (
                <div className="absolute inset-4 pointer-events-none flex items-center justify-center">
                  <div className="text-center text-muted-foreground/50">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Start typing to see magic happen</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Output */}
          <Card className="p-0 bg-gradient-card shadow-soft border-0 overflow-hidden group">
            <div className="p-4 bg-primary/5 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Improved Text
                  {isOutputEdited && (
                    <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                      Edited
                    </Badge>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {outputText && (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      {outputText.split(/\s+/).filter(word => word.length > 0).length} words
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-6 w-6 p-0"
                    >
                      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSwapText}
                      className="h-6 w-6 p-0"
                      title="Use as new input"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 relative">
              <Textarea
                ref={outputRef}
                value={outputText}
                onChange={handleOutputTextChange}
                placeholder="Your improved text will appear here after processing..."
                className="min-h-[300px] border-0 bg-transparent resize-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground transition-all duration-200"
              />
              {isProcessing && (
                <div className="absolute inset-4 pointer-events-none flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Improving your text...</p>
                  </div>
                </div>
              )}
              {!outputText && !isProcessing && (
                <div className="absolute inset-4 pointer-events-none flex items-center justify-center">
                  <div className="text-center text-muted-foreground/50">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Enhanced text will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};