import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Languages, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translateSpeechToSpeech, TranslationResult } from '@/services/translationServiceASR';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

type Speaker = 'doctor' | 'patient';

export default function TranslationInterface() {
  const [doctorLang, setDoctorLang] = useState('en');
  const [patientLang, setPatientLang] = useState('te');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [processingStage, setProcessingStage] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio player
    audioPlayerRef.current = new Audio();
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async (speaker: Speaker) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      // Try to use the best available format
      const options: MediaRecorderOptions = { mimeType: 'audio/webm' };
      
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        options.mimeType = 'audio/ogg;codecs=opus';
      }
      
      console.log('Recording with format:', options.mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, options);
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        // Process the recording
        await processAudio(audioBlob, speaker);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setActiveSpeaker(speaker);
      
      toast.success(`Recording from ${speaker}...`);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob, speaker: Speaker) => {
    setIsProcessing(true);
    setResult(null);

    const sourceLang = speaker === 'doctor' ? doctorLang : patientLang;
    const targetLang = speaker === 'doctor' ? patientLang : doctorLang;

    try {
      // Check if languages are the same
      if (sourceLang === targetLang) {
        toast.error('Source and target languages cannot be the same');
        setIsProcessing(false);
        return;
      }

      setProcessingStage('Converting speech to text...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setProcessingStage('Translating text...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setProcessingStage('Generating speech...');
      
      const translationResult = await translateSpeechToSpeech(
        audioBlob,
        sourceLang,
        targetLang
      );

      setResult(translationResult);
      setProcessingStage('');
      
      // Play the translated audio
      if (audioPlayerRef.current && translationResult.translatedAudioUrl) {
        audioPlayerRef.current.src = translationResult.translatedAudioUrl;
        audioPlayerRef.current.play();
        toast.success('Translation complete! Playing audio...');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
      setProcessingStage('');
    } finally {
      setIsProcessing(false);
      setActiveSpeaker(null);
    }
  };

  const playAudio = () => {
    if (audioPlayerRef.current && result?.translatedAudioUrl) {
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play();
      toast.info('Playing translated audio...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        {/* <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Languages className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Medical Translator
            </h1>
          </div>
          <p className="text-muted-foreground">
            Real-time speech translation for doctor-patient communication
          </p>
        </div> */}

        {/* Language Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Doctor Card */}
          <Card className="p-6 shadow-card hover:shadow-soft transition-shadow duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Doctor</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Doctor's Language
                </label>
                <Select value={doctorLang} onValueChange={setDoctorLang}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => isRecording ? stopRecording() : startRecording('doctor')}
                disabled={isProcessing || (isRecording && activeSpeaker !== 'doctor')}
                className="w-full h-20 text-lg font-semibold relative overflow-hidden group"
                variant={isRecording && activeSpeaker === 'doctor' ? 'destructive' : 'default'}
              >
                <div className="flex items-center gap-3">
                  {isRecording && activeSpeaker === 'doctor' ? (
                    <>
                      <MicOff className="w-6 h-6 animate-pulse" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      <span>Start Recording</span>
                    </>
                  )}
                </div>
                {isRecording && activeSpeaker === 'doctor' && (
                  <div className="absolute inset-0 bg-destructive/20 animate-pulse" />
                )}
              </Button>
            </div>
          </Card>

          {/* Patient Card */}
          <Card className="p-6 shadow-card hover:shadow-soft transition-shadow duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">Patient</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Patient's Language
                </label>
                <Select value={patientLang} onValueChange={setPatientLang}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => isRecording ? stopRecording() : startRecording('patient')}
                disabled={isProcessing || (isRecording && activeSpeaker !== 'patient')}
                className="w-full h-20 text-lg font-semibold relative overflow-hidden"
                variant={isRecording && activeSpeaker === 'patient' ? 'destructive' : 'default'}
              >
                <div className="flex items-center gap-3">
                  {isRecording && activeSpeaker === 'patient' ? (
                    <>
                      <MicOff className="w-6 h-6 animate-pulse" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      <span>Start Recording</span>
                    </>
                  )}
                </div>
                {isRecording && activeSpeaker === 'patient' && (
                  <div className="absolute inset-0 bg-destructive/20 animate-pulse" />
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <p className="text-primary font-medium ml-2">{processingStage}</p>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && !isProcessing && (
          <Card className="p-6 shadow-soft border-accent/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Languages className="w-5 h-5 text-accent" />
                  Translation Result
                </h3>
                <Button
                  onClick={playAudio}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Play Audio
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Original Text:
                  </p>
                  <p className="text-foreground">{result.sourceText}</p>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Translated Text:
                  </p>
                  <p className="text-foreground font-medium">{result.translatedText}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            How to Use
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">1.</span>
              <span>Select the language for both doctor and patient</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">2.</span>
              <span>Click the microphone button to start recording (max 20 seconds)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">3.</span>
              <span>Click again to stop recording and start translation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">4.</span>
              <span>The translated audio will play automatically</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
