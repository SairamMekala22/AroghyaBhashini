import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ProcessingSteps } from '@/components/ProcessingSteps';
import { AudioPlayer } from '@/components/AudioPlayer';
import { TextDisplay } from '@/components/TextDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Language, ProcessingStep, TranslationResult } from '@/types/translation';
import { translationService } from '@/services/translationService';
import { ArrowRight, Stethoscope, RotateCcw } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [sourceLanguage, setSourceLanguage] = useState<Language>('en');
  const [targetLanguage, setTargetLanguage] = useState<Language>('te');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { name: 'Extract Text (OCR)', status: 'pending' },
    { name: 'Translate Text', status: 'pending' },
    { name: 'Generate Speech', status: 'pending' },
  ]);

  const updateStep = (index: number, status: ProcessingStep['status'], message?: string) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status, message } : step
    ));
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload a prescription image first',
        variant: 'destructive',
      });
      return;
    }

    if (sourceLanguage === targetLanguage) {
      toast({
        title: 'Invalid language selection',
        description: 'Source and target languages must be different',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);
    
    // Reset steps
    setSteps([
      { name: 'Extract Text (OCR)', status: 'pending' },
      { name: 'Translate Text', status: 'pending' },
      { name: 'Generate Speech', status: 'pending' },
    ]);

    try {
      // Step 1: OCR
      updateStep(0, 'processing', 'Reading text from image...');
      const extractedText = await translationService.performOCR(
        selectedImage,
        sourceLanguage,
        targetLanguage
      );
      updateStep(0, 'completed', `Extracted ${extractedText.length} characters`);

      // Step 2: Translation
      updateStep(1, 'processing', 'Translating text...');
      const translatedText = await translationService.translateText(
        extractedText,
        sourceLanguage,
        targetLanguage
      );
      updateStep(1, 'completed', 'Translation completed');

      // Step 3: TTS
      updateStep(2, 'processing', 'Generating speech...');
      const audioUrl = await translationService.generateSpeech(
        translatedText,
        sourceLanguage,
        targetLanguage
      );
      updateStep(2, 'completed', 'Audio generated successfully');

      setResult({
        extractedText,
        translatedText,
        audioUrl,
      });

      toast({
        title: 'Success!',
        description: 'Translation completed successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      // Find the current processing step and mark it as error
      const currentStepIndex = steps.findIndex(s => s.status === 'processing');
      if (currentStepIndex !== -1) {
        updateStep(currentStepIndex, 'error', errorMessage);
      }

      toast({
        title: 'Processing failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setSteps([
      { name: 'Extract Text (OCR)', status: 'pending' },
      { name: 'Translate Text', status: 'pending' },
      { name: 'Generate Speech', status: 'pending' },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-medical">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-medical bg-clip-text text-transparent">
            Prescription Translator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Convert prescription images to speech in your preferred language
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <Card className="p-6 shadow-soft border-border">
              <h2 className="text-xl font-semibold mb-6">Upload & Configure</h2>
              
              <div className="space-y-6">
                <ImageUpload
                  onImageSelect={setSelectedImage}
                  disabled={isProcessing}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <LanguageSelector
                    value={sourceLanguage}
                    onChange={setSourceLanguage}
                    label="Source Language"
                    disabled={isProcessing}
                  />
                  <LanguageSelector
                    value={targetLanguage}
                    onChange={setTargetLanguage}
                    label="Target Language"
                    disabled={isProcessing}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleProcess}
                    disabled={!selectedImage || isProcessing || sourceLanguage === targetLanguage}
                    className="flex-1 gradient-medical shadow-soft"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : 'Translate & Speak'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  {(selectedImage || result) && (
                    <Button
                      onClick={handleReset}
                      disabled={isProcessing}
                      variant="outline"
                      size="lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Processing & Results */}
          <div className="space-y-6">
            <Card className="p-6 shadow-soft border-border">
              <h2 className="text-xl font-semibold mb-6">Processing Status</h2>
              <ProcessingSteps steps={steps} />
            </Card>

            {result && (
              <>
                <Card className="p-6 shadow-soft border-border">
                  <h2 className="text-xl font-semibold mb-6">Audio Output</h2>
                  <AudioPlayer audioUrl={result.audioUrl} />
                </Card>

                <TextDisplay
                  extractedText={result.extractedText}
                  translatedText={result.translatedText}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Bhashini APIs • Supports English, Telugu, and Hindi</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
