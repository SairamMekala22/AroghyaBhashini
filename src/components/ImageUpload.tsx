import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ onImageSelect, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-primary" />
        Medical Report Image
      </label>
      
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-lg transition-all ${
            dragActive 
              ? "border-primary bg-secondary/50" 
              : "border-border hover:border-primary/50 bg-card"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Upload className="w-12 h-12 text-primary mb-4" />
            <p className="text-foreground font-medium mb-1">
              Drop your medical report image here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (JPG, PNG - max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border bg-card">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-contain bg-muted"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
