import { useCallback, useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ onImageSelect, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearImage = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-smooth",
            "flex flex-col items-center justify-center min-h-[280px]",
            isDragging && !disabled && "border-medical-primary bg-medical-light/50 scale-105",
            !isDragging && "border-border hover:border-medical-primary/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={cn(
              "p-4 rounded-full transition-smooth",
              isDragging ? "bg-medical-primary/10 scale-110" : "bg-muted"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-smooth",
                isDragging ? "text-medical-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Upload Prescription Image</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG (Max 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden shadow-soft border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-[400px] object-contain bg-muted"
          />
          <Button
            onClick={clearImage}
            disabled={disabled}
            size="icon"
            variant="destructive"
            className="absolute top-3 right-3 shadow-lg"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center gap-2 text-white">
              <FileImage className="w-4 h-4" />
              <span className="text-sm font-medium">Prescription Image Loaded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
