import { useLanguage } from '@/contexts/LanguageContext';
import { useUILanguage } from '@/contexts/UILanguageContext';
import { translateImage } from '@/api/apiClient';
import LanguageSelector from '@/components/LanguageSelector';
import PrescriptionUploader from '@/components/PrescriptionUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const PrescriptionPage = () => {
  const { doctorLanguage, patientLanguage, setDoctorLanguage, setPatientLanguage } = useLanguage();
  const { t } = useUILanguage();
  const { toast } = useToast();

  const handleTranslation = async (file: File) => {
    try {
      const response = await translateImage(file, doctorLanguage, patientLanguage);
      return {
        originalText: response.original_text || 'Extracted text from prescription',
        translatedText: response.translated_text || 'Translated prescription content',
        audioUrl: response.audio_url,
      };
    } catch (error) {
      console.error('Translation error:', error);
      
      // Return mock data for demo purposes
      toast({
        title: 'Using Demo Data',
        description: 'API unavailable. Showing example translation.',
      });
      
      return {
        originalText: 'Tab. Paracetamol 500mg - Take twice daily after meals',
        translatedText: 'टैब. पैरासिटामोल 500mg - भोजन के बाद दिन में दो बार लें',
        audioUrl: undefined,
      };
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle p-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('rx.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('rx.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-medium border-2 border-border sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🌐</span> {t('rx.settings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LanguageSelector
                  label={t('rx.from')}
                  value={doctorLanguage}
                  onChange={setDoctorLanguage}
                  icon="📄"
                />
                <LanguageSelector
                  label={t('rx.to')}
                  value={patientLanguage}
                  onChange={setPatientLanguage}
                  icon="🗣️"
                />
              </CardContent>
            </Card>
          </div>

          {/* Upload Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-large border-2 border-border">
              <CardHeader className="border-b border-border bg-card">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>📋</span> {t('rx.upload')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PrescriptionUploader onTranslate={handleTranslation} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
