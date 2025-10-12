import { LANGUAGE_CONFIGS, API_KEY } from '@/config/languageConfigs';
import { Language } from '@/types/translation';

export class TranslationService {
  private getConfig(source: Language, target: Language) {
    const key = `${source}-${target}`;
    const config = LANGUAGE_CONFIGS[key];
    if (!config) {
      throw new Error(`No configuration found for ${source} to ${target} translation`);
    }
    return config;
  }

  async performOCR(imageFile: File, source: Language, target: Language): Promise<string> {
    const config = this.getConfig(source, target);
    
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Image file size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(config.ocr, {
      method: 'POST',
      headers: {
        'access-token': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'OCR processing failed');
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.error || 'OCR processing failed');
    }

    return data.data.decoded_text;
  }

  async translateText(text: string, source: Language, target: Language): Promise<string> {
    const config = this.getConfig(source, target);
    
    const words = text.trim().split(/\s+/);
    if (words.length > 50) {
      throw new Error('Text must be 50 words or less for translation');
    }

    const response = await fetch(config.mt, {
      method: 'POST',
      headers: {
        'access-token': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_text: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Translation failed');
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.error || 'Translation failed');
    }

    return data.data.output_text;
  }

  async generateSpeech(text: string, source: Language, target: Language, gender: 'male' | 'female' = 'female'): Promise<string> {
    const config = this.getConfig(source, target);
    
    const words = text.trim().split(/\s+/);
    if (words.length > 30) {
      throw new Error('Text must be 30 words or less for speech generation');
    }

    const response = await fetch(config.tts, {
      method: 'POST',
      headers: {
        'access-token': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        gender: gender,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Speech generation failed');
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.error || 'Speech generation failed');
    }

    return data.data.s3_url;
  }

  async processComplete(imageFile: File, source: Language, target: Language): Promise<{
    extractedText: string;
    translatedText: string;
    audioUrl: string;
  }> {
    const extractedText = await this.performOCR(imageFile, source, target);
    const translatedText = await this.translateText(extractedText, source, target);
    const audioUrl = await this.generateSpeech(translatedText, source, target);

    return {
      extractedText,
      translatedText,
      audioUrl,
    };
  }
}

export const translationServiceOCR = new TranslationService();
