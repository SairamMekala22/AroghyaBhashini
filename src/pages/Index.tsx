import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ImageUpload } from "@/components/ImageUpload";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<Array<{
    label: string;
    status: 'pending' | 'processing' | 'complete' | 'error';
  }>>([
    { label: "Extracting text from image (OCR)", status: 'pending' },
    { label: "Summarizing with AI", status: 'pending' },
    { label: "Translating to selected language", status: 'pending' },
    { label: "Converting to speech", status: 'pending' },
  ]);
  const { toast } = useToast();

  const updateStep = (index: number, status: 'pending' | 'processing' | 'complete' | 'error') => {
    setProcessingSteps(prev => 
      prev.map((step, i) => i === index ? { ...step, status } : step)
    );
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload a medical report image first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAudioUrl(null);
    
    // Reset all steps to pending
    setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const base64Data = base64Image.split(',')[1];

        try {
          const { data, error } = await supabase.functions.invoke('process-medical-report', {
            body: {
              image: base64Data,
              language: selectedLanguage,
              onProgress: (step: number) => {
                updateStep(step, 'complete');
                if (step < processingSteps.length - 1) {
                  updateStep(step + 1, 'processing');
                }
              }
            },
          });

          if (error) throw error;

          if (data?.audioUrl) {
            setAudioUrl(data.audioUrl);
            updateStep(processingSteps.length - 1, 'complete');
            toast({
              title: "Success!",
              description: "Medical report processed successfully.",
            });
          }
        } catch (error: any) {
          console.error('Processing error:', error);
          toast({
            title: "Processing failed",
            description: error.message || "Failed to process the medical report. Please try again.",
            variant: "destructive",
          });
          setProcessingSteps(prev => prev.map(step => 
            step.status === 'processing' ? { ...step, status: 'error' as const } : step
          ));
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Failed to read the image file.",
          variant: "destructive",
        });
        setIsProcessing(false);
      };
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Medical Report Summarizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a medical report image and get an AI-powered summary in your preferred language
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 space-y-6">
          <LanguageSelector
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            disabled={isProcessing}
          />

          <ImageUpload
            onImageSelect={setSelectedImage}
            disabled={isProcessing}
          />

          <Button
            onClick={handleProcess}
            disabled={!selectedImage || isProcessing}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isProcessing ? (
              <>
                <span className="animate-pulse">Processing...</span>
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <ProcessingStatus steps={processingSteps} />
        )}

        {/* Audio Player */}
        {audioUrl && (
          <AudioPlayer audioUrl={audioUrl} />
        )}
      </div>
    </div>
  );
};

export default Index;
