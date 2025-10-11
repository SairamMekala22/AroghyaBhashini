import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUILanguage } from '@/contexts/UILanguageContext';

interface TranslationResult {
  originalText: string;
  translatedText: string;
  audioUrl?: string;
}

interface PrescriptionUploaderProps {
  onTranslate: (file: File) => Promise<TranslationResult>;
}

const PrescriptionUploader = ({ onTranslate }: PrescriptionUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useUILanguage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const translationResult = await onTranslate(selectedFile);
      setResult(translationResult);
      toast({
        title: '✅ Translation Complete',
        description: 'Your prescription has been translated successfully',
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Failed',
        description: 'Could not translate the prescription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (result?.audioUrl) {
      const audio = new Audio(result.audioUrl);
      audio.play();
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <Card className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer shadow-soft">
          <CardContent className="p-12">
            <label className="flex flex-col items-center cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-medium">
                <Upload className="text-primary-foreground" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('rx.drag')}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {t('rx.formats')}
              </p>
            </label>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden shadow-medium border-2 border-border">
            <CardContent className="p-0">
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Prescription preview"
                    className="w-full h-auto max-h-96 object-contain bg-secondary"
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={resetUpload}
                      className="shadow-medium"
                    >
                      Change Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!result && (
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
              size="lg"
              className="w-full bg-gradient-primary hover:opacity-90 shadow-medium"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  {t('rx.translating')}
                </>
              ) : (
                <>
                  <FileText className="mr-2" size={20} />
                  {t('rx.translate')}
                </>
              )}
            </Button>
          )}

          {result && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <Card className="shadow-medium border-2 border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <span>📄</span> {t('rx.original')}
                    </h4>
                    <p className="text-sm text-foreground bg-secondary p-4 rounded-lg border border-border">
                      {result.originalText}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <span>🌐</span> {t('rx.translated')}
                    </h4>
                    <p className="text-sm text-foreground bg-gradient-primary/10 p-4 rounded-lg border-2 border-primary">
                      {result.translatedText}
                    </p>
                  </div>

                  {result.audioUrl && (
                    <Button
                      onClick={playAudio}
                      variant="outline"
                      className="w-full border-2"
                    >
                      <Volume2 className="mr-2" size={18} />
                      {t('rx.listen')}
                    </Button>
                  )}

                  <Button
                    onClick={resetUpload}
                    variant="secondary"
                    className="w-full"
                  >
                    Upload Another Prescription
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PrescriptionUploader;
