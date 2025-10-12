import { Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface AudioPlayerProps {
  audioUrl: string;
}

export const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  return (
    <div className="w-full p-6 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Volume2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Summary Audio</h3>
      </div>
      <audio
        ref={audioRef}
        controls
        className="w-full"
        style={{
          filter: 'hue-rotate(180deg)',
        }}
      >
        <source src={audioUrl} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
