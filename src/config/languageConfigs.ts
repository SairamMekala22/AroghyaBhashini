import { LanguageConfig } from '@/types/translation';

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  'te-en': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f65f502ae0a19488455b5',
    ocrLang: 'te-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb923163869',
    mtSource: 'te',
    mtTarget: 'en',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca8b3e0b95a6a1ea34a93',
    ttsLang: 'en-IN',
  },
  'en-te': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f420802ae0a1948845594',
    ocrLang: 'en-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316389a',
    mtSource: 'en',
    mtTarget: 'te',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67b842f39c21bec07537674e',
    ttsLang: 'te-IN',
  },
  'en-hi': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f420802ae0a1948845594',
    ocrLang: 'en-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316383c',
    mtSource: 'en',
    mtTarget: 'hi',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca89ae0b95a6a1ea34a92',
    ttsLang: 'hi-IN',
  },
  'hi-en': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/6711fe751595b8ffe97adc1f',
    ocrLang: 'hi-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316384a',
    mtSource: 'hi',
    mtTarget: 'en',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca8b3e0b95a6a1ea34a93',
    ttsLang: 'en-IN',
  },
  'hi-te': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/6711fe751595b8ffe97adc1f',
    ocrLang: 'hi-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316388e',
    mtSource: 'hi',
    mtTarget: 'te',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67b842f39c21bec07537674e',
    ttsLang: 'te-IN',
  },
  'te-hi': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f65f502ae0a19488455b5',
    ocrLang: 'te-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb923163897',
    mtSource: 'te',
    mtTarget: 'hi',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca89ae0b95a6a1ea34a92',
    ttsLang: 'hi-IN',
  },
};

export const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTZmNjRiOTNlM2JlYzkwMWZkYTViIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.q6HNVdL8UxUSMBR6Mj7K1HNnzD5Dw3DGG79v8RSS_ic';
