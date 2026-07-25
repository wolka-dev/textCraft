import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowRight, Sparkles, Languages, Wand2, Copy, RotateCcw, Check, Loader2, Zap, Target, MessageSquare, CheckCircle, Briefcase, Heart, Coffee, Building, Mail, MessageSquare as SlackIcon, FileText, X, ChevronDown, ChevronUp, Settings, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/hooks/use-local-storage';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isOutputEdited, setIsOutputEdited] = useState(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  
  const isMobile = useIsMobile();

  // Use localStorage for persistent user preferences
  const {
    selectedStyle,
    setSelectedStyle,
    selectedPlatform,
    setSelectedPlatform,
    selectedLanguage,
    setSelectedLanguage,
    customLanguage,
    setCustomLanguage,
    extraPrompt,
    setExtraPrompt,
    clearPreferences,
  } = useUserPreferences();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);



  // Update word count
  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [inputText]);

  const handleImproveText = useCallback(async () => {
    if (!inputText.trim()) {
      inputRef.current?.focus();
      return;
    }

    if (!selectedStyle) {
      return;
    }

    setIsProcessing(true);
    
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
      
    } catch (error) {
      console.error('Error improving text:', error);
      toast.error('Failed to improve text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, selectedStyle, selectedPlatform, customLanguage, selectedLanguage, extraPrompt]);

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
    inputRef.current?.focus();
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setInputText(text);
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleCopy = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
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

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Get the pasted text from clipboard
    const pastedText = e.clipboardData.getData('text');
    
    // Let the default paste behavior happen first
    setTimeout(async () => {
      // Check if we have pasted text and a selected style
      if (pastedText.trim() && selectedStyle && !isProcessing) {
        await handleImproveText();
      }
    }, 100); // Small delay to ensure the paste operation completes
  };

  // Get current selected language for display
  const currentLanguage = languages.find(l => l.value === selectedLanguage);
  
  // Get current selections for summary
  const currentStyle = styles.find(s => s.value === selectedStyle);
  const currentPlatform = platforms.find(p => p.value === selectedPlatform);
  
  // Create summary text for mobile
  const getControlsSummary = () => {
    const parts = [];
    if (currentStyle) parts.push(currentStyle.label);
    if (currentLanguage) parts.push(currentLanguage.flag + ' ' + currentLanguage.label);
    if (currentPlatform) parts.push(currentPlatform.label);
    if (customLanguage.trim()) parts.push(`Custom: ${customLanguage}`);
    if (extraPrompt.trim()) parts.push('+ Extra');
    return parts.join(' • ');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Controls */}
        <Card className="bg-gradient-card shadow-soft border-0">
          {/* Mobile Summary Header */}
          {isMobile && (
            <div 
              className="p-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Settings className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm">Settings</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {getControlsSummary() || 'Configure your preferences'}
                    </p>
                  </div>
                </div>
                {/* Expand/Collapse Indicator */}
                <div className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted/50 transition-colors">
                  {isControlsExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Controls Content */}
          <div className={`${isMobile && !isControlsExpanded ? 'hidden' : 'block'} p-4 sm:p-6`}>
            <div className="space-y-4 sm:space-y-6">
              {/* Preferences Saved Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="hidden sm:inline">Preferences are automatically saved</span>
                  <span className="sm:hidden">Auto-saved</span>
                </div>
              </div>
            {/* Writing Style Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Writing Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                {styles.map((style) => {
                  const IconComponent = style.icon;
                  return (
                    <Tooltip key={style.value}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedStyle(style.value)}
                          className={`flex items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
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
                            <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors text-xs sm:text-sm truncate">{style.label}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  Output Language
                </label>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
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
                              <span className="text-base sm:text-lg">{currentLanguage.flag}</span>
                              <span className="text-sm sm:text-base">{currentLanguage.label}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-base sm:text-lg">{language.flag}</span>
                              <span className="text-sm sm:text-base">{language.label}</span>
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
                <div className="space-y-2">
                  <Input
                    value={extraPrompt}
                    onChange={(e) => setExtraPrompt(e.target.value)}
                    placeholder="Add specific instructions (e.g., 'make it shorter', 'add emojis')..."
                    className="bg-background/50 border-border/50 hover:border-primary/30 transition-smooth"
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Keep instructions clear and concise</span>
                    <span className={extraPrompt.length > 150 ? 'text-orange-500' : ''}>
                      {extraPrompt.length}/200
                    </span>
                  </div>
                </div>
              </div>
            </div>
             
            {/* Platform and Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Platform Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <label className="text-sm font-medium text-foreground flex items-center gap-2 whitespace-nowrap">
                  <Target className="h-4 w-4 text-primary" />
                  Platform:
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <button
                        key={platform.value}
                        onClick={() => setSelectedPlatform(platform.value)}
                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all duration-200 cursor-pointer group ${
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
                          <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors text-xs sm:text-sm truncate">{platform.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
                <Button 
                  onClick={handleImproveText} 
                  disabled={isProcessing || !inputText.trim() || !selectedStyle}
                  className="bg-gradient-primary hover:shadow-medium transition-smooth w-full sm:w-auto"
                  size="default"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Processing</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Improve Text</span>
                      <span className="sm:hidden">Improve</span>
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearPreferences}
                  className="hover:bg-muted/50 transition-smooth w-full sm:w-auto"
                  disabled={isProcessing}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Reset Preferences</span>
                  <span className="sm:hidden">Reset Settings</span>
                </Button>

              </div>
            </div>
            </div>
          </div>
        </Card>

        {/* Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input */}
          <Card className="p-0 bg-gradient-card shadow-soft border-0 overflow-hidden group">
            <div className="p-3 sm:p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between h-[52px]">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Original Text</span>
                  <span className="sm:hidden">Original</span>
                </h3>
              </div>
              <div className="flex items-center gap-2 h-[24px]">
                {inputText && (
                  <Badge variant="secondary" className="text-xs">
                    {wordCount} words
                  </Badge>
                )}
                {inputText && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClear}
                    className="h-6 w-6 p-0"
                    title="Clear input text"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="p-3 sm:p-4 relative">
              <Textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPaste={handlePaste}
                placeholder="Paste or type your text here. For example: 'Hi, I hope you are doing well. I wanted to ask if we can meet tomorrow to discuss the project.'"
                className="min-h-[200px] sm:min-h-[300px] border-0 bg-transparent resize-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground transition-all duration-200 text-sm sm:text-base"
              />
              {!inputText && (
                <div className="absolute inset-3 sm:inset-4 pointer-events-none flex items-center justify-center">
                  <div className="text-center text-muted-foreground/50">
                    <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs sm:text-sm">Start typing to see magic happen</p>
                  </div>
                </div>
              )}
              
              {/* Floating Action Button - Only on mobile */}
              {isMobile && selectedStyle && (
                <div className="absolute bottom-4 right-4 pointer-events-auto">
                  {inputText.trim() ? (
                    // Improve Button when text exists
                    <Button
                      onClick={handleImproveText}
                      disabled={isProcessing}
                      size="sm"
                      className="bg-gradient-primary hover:shadow-large transition-all duration-200 h-10 px-4 rounded-full shadow-medium hover:scale-105"
                      title="Improve text"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm font-medium">Improving...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Improve</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    // Paste Button when field is empty
                    <Button
                      onClick={handlePasteClick}
                      size="sm"
                      className="bg-gradient-primary hover:shadow-large transition-all duration-200 h-10 px-4 rounded-full shadow-medium hover:scale-105"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Paste</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Output */}
          <Card className="p-0 bg-gradient-card shadow-soft border-0 overflow-hidden group">
            <div className="p-3 sm:p-4 bg-primary/5 border-b border-border/50 flex items-center justify-between h-[52px]">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Improved Text</span>
                  <span className="sm:hidden">Improved</span>
                  {isOutputEdited && (
                    <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                      Edited
                    </Badge>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-2 h-[24px]">
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
                      title="Copy to clipboard"
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
            <div className="p-3 sm:p-4 relative">
              <Textarea
                ref={outputRef}
                value={outputText}
                onChange={handleOutputTextChange}
                placeholder="Your improved text will appear here after processing..."
                className="min-h-[200px] sm:min-h-[300px] border-0 bg-transparent resize-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground transition-all duration-200 text-sm sm:text-base"
              />
              {isProcessing && (
                <div className="absolute inset-3 sm:inset-4 pointer-events-none flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Improving your text...</p>
                  </div>
                </div>
              )}
              {!outputText && !isProcessing && (
                <div className="absolute inset-3 sm:inset-4 pointer-events-none flex items-center justify-center">
                  <div className="text-center text-muted-foreground/50">
                    <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs sm:text-sm">Enhanced text will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
  );
};