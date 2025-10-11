import { FileText, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextDisplayProps {
  extractedText: string;
  translatedText: string;
}

export const TextDisplay = ({ extractedText, translatedText }: TextDisplayProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="shadow-soft border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-medical-primary" />
            Extracted Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {extractedText || 'No text extracted yet'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Languages className="w-4 h-4 text-medical-secondary" />
            Translated Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {translatedText || 'No translation yet'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
