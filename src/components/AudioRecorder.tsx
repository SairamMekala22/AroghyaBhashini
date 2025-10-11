import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUILanguage } from '@/contexts/UILanguageContext';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
  speaker: 'doctor' | 'patient';
}

const AudioRecorder = ({ onRecordingComplete, isProcessing, speaker }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { t } = useUILanguage();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({
        title: '🎤 Recording started',
        description: `Recording ${speaker === 'doctor' ? 'doctor' : 'patient'} audio...`,
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Microphone Error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speakerIcon = speaker === 'doctor' ? '👨‍⚕️' : '🙋';
  const speakerLabel = speaker === 'doctor' ? 'Doctor' : 'Patient';

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl border-2 border-border shadow-medium">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <span className="text-lg">{speakerIcon}</span>
        <span>{speakerLabel} Speaking</span>
      </div>

      {isRecording && (
        <div className="text-2xl font-bold text-primary animate-pulse">
          {formatTime(recordingTime)}
        </div>
      )}

      <div className="flex gap-3">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isProcessing}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-large transition-all duration-200 hover:scale-105"
          >
            <Mic className="mr-2" size={20} />
            {t('conv.start')}
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="shadow-large transition-all duration-200 hover:scale-105"
          >
            <Square className="mr-2" size={20} />
            {t('conv.stop')}
          </Button>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-200">
          <Loader2 className="animate-spin" size={16} />
          <span>{t('conv.processing')}</span>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
