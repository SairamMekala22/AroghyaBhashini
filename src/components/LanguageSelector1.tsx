import { Language } from '@/types/translation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
  label: string;
  disabled?: boolean;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'te', label: 'Telugu (తెలుగు)' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
];

export const LanguageSelector1 = ({ value, onChange, label, disabled }: LanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Languages className="w-4 h-4 text-medical-primary" />
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-card shadow-soft border-border">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
