import { useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUILanguage } from '@/contexts/UILanguageContext';

export interface Message {
  id: string;
  speaker: 'doctor' | 'patient';
  originalText: string;
  translatedText: string;
  audioUrl?: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { t } = useUILanguage();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-large">
            <span className="text-4xl">💬</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{t('conv.empty').split('.')[0]}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('conv.empty').split('.')[1]}
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => {
            const isDoctor = message.speaker === 'doctor';
            return (
              <div
                key={message.id}
                className={`flex ${isDoctor ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-4 duration-300`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 shadow-medium ${
                    isDoctor
                      ? 'bg-card border border-border'
                      : 'bg-gradient-primary text-primary-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {isDoctor ? '👨‍⚕️' : '🙋'}
                    </span>
                    <span className="text-xs font-semibold opacity-90">
                      {isDoctor ? 'Doctor' : 'Patient'}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2 font-medium">{message.translatedText}</p>
                  
                  {message.originalText !== message.translatedText && (
                    <p className={`text-xs opacity-75 italic border-t pt-2 ${
                      isDoctor ? 'border-border' : 'border-primary-foreground/20'
                    }`}>
                      Original: {message.originalText}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs opacity-70`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.audioUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(message.audioUrl!)}
                        className={`h-7 px-2 ${
                          isDoctor
                            ? 'hover:bg-secondary'
                            : 'hover:bg-primary-foreground/20 text-primary-foreground'
                        }`}
                      >
                        <Volume2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
