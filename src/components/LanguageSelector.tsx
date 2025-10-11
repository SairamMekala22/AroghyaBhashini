import { languages } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface LanguageSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: string;
}

const LanguageSelector = ({ label, value, onChange, icon }: LanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-card border-2 border-border hover:border-primary transition-colors">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border max-h-[300px]">
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="cursor-pointer hover:bg-secondary"
            >
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
