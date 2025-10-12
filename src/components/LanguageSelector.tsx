import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const LanguageSelector = ({ value, onValueChange, disabled }: LanguageSelectorProps) => {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        Output Language
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full h-12 bg-card border-border hover:border-primary transition-all">
          <SelectValue placeholder="Select output language" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="en" className="cursor-pointer hover:bg-secondary">English</SelectItem>
          <SelectItem value="te" className="cursor-pointer hover:bg-secondary">Telugu (తెలుగు)</SelectItem>
          <SelectItem value="hi" className="cursor-pointer hover:bg-secondary">Hindi (हिन्दी)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
