import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUILanguage } from '@/contexts/UILanguageContext';
import { translateSpeech } from '@/api/apiClient';
import LanguageSelector from '@/components/LanguageSelector';
import ChatWindow, { Message } from '@/components/ChatWindow';
import AudioRecorder from '@/components/AudioRecorder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const ConversationPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'doctor' | 'patient'>('doctor');
  const { doctorLanguage, patientLanguage, setDoctorLanguage, setPatientLanguage } = useLanguage();
  const { t } = useUILanguage();
  const { toast } = useToast();

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert blob to file
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      // Determine source and target languages based on active speaker
      const sourceLanguage = activeSpeaker === 'doctor' ? doctorLanguage : patientLanguage;
      const targetLanguage = activeSpeaker === 'doctor' ? patientLanguage : doctorLanguage;

      // Call translation API
      const response = await translateSpeech(audioFile, sourceLanguage, targetLanguage);

      // Create new message
      const newMessage: Message = {
        id: Date.now().toString(),
        speaker: activeSpeaker,
        originalText: response.original_text || 'Audio recorded',
        translatedText: response.translated_text || 'Translation in progress...',
        audioUrl: response.audio_url,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      
      // Play audio automatically if available
      if (response.audio_url) {
        const audio = new Audio(response.audio_url);
        audio.play();
      }

    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Failed',
        description: 'Could not process the audio. Using mock data for demo.',
        variant: 'destructive',
      });

      // Mock response for demo purposes
      const mockMessage: Message = {
        id: Date.now().toString(),
        speaker: activeSpeaker,
        originalText: activeSpeaker === 'doctor' 
          ? 'How are you feeling today?' 
          : 'मैं बेहतर महसूस कर रहा हूं',
        translatedText: activeSpeaker === 'doctor'
          ? 'आप आज कैसा महसूस कर रहे हैं?'
          : 'I am feeling better',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, mockMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('conv.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('conv.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-medium border-2 border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>⚙️</span> {t('conv.settings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LanguageSelector
                  label={t('conv.doctor')}
                  value={doctorLanguage}
                  onChange={setDoctorLanguage}
                  icon="👨‍⚕️"
                />
                <LanguageSelector
                  label={t('conv.patient')}
                  value={patientLanguage}
                  onChange={setPatientLanguage}
                  icon="🙋"
                />
              </CardContent>
            </Card>

            <Card className="shadow-medium border-2 border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🎤</span> {t('conv.chat')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeSpeaker} onValueChange={(val) => setActiveSpeaker(val as 'doctor' | 'patient')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="doctor">👨‍⚕️ Doctor</TabsTrigger>
                    <TabsTrigger value="patient">🙋 Patient</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              isProcessing={isProcessing}
              speaker={activeSpeaker}
            />
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-16rem)] flex flex-col shadow-large border-2 border-border">
              <CardHeader className="border-b border-border bg-card">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>💬</span> {t('conv.chat')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ChatWindow messages={messages} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
