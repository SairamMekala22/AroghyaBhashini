export type Language = 'en' | 'te' | 'hi';

export interface LanguageConfig {
  ocr: string;
  ocrLang: string;
  mt: string;
  mtSource: string;
  mtTarget: string;
  tts: string;
  ttsLang: string;
}

export interface ProcessingStep {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  message?: string;
}

export interface TranslationResult {
  extractedText: string;
  translatedText: string;
  audioUrl: string;
}
