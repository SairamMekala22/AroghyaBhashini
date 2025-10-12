const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTY3ZjNiOTNlM2JlYzkwMWZkOTdiIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.4TU3blATSP80efaUzzYbHHEspL42g3HjEHaSqW2dF6Q";

interface ASRResponse {
  status: string;
  message: string;
  data: {
    recognized_text: string;
  };
  error: null | string;
  code: number;
}

interface MTResponse {
  status: string;
  message: string;
  data: {
    output_text: string;
  };
  error: null | string;
  code: number;
}

interface TTSResponse {
  status: string;
  message: string;
  data: {
    s3_url: string;
  };
  error: null | string;
  code: number;
}

// ASR - Audio Speech Recognition
async function asr(endpoint: string, languageCode: string, audioBlob: Blob): Promise<string> {
  try {
    console.log('Starting ASR conversion...');
    console.log('Original blob type:', audioBlob.type, 'size:', audioBlob.size);
    
    const formData = new FormData();
    
    // Convert blob to wav if needed
    const wavBlob = await convertToWav(audioBlob);
    console.log('Converted WAV blob type:', wavBlob.type, 'size:', wavBlob.size);
    
    formData.append('audio_file', wavBlob, 'audio.wav');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'access-token': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ASR API Error:', response.status, errorText);
      throw new Error(`ASR failed (${response.status}): ${errorText}`);
    }

    const result: ASRResponse = await response.json();
    console.log('ASR result:', result);
    return result.data.recognized_text;
  } catch (error) {
    console.error('ASR error details:', error);
    throw error;
  }
}

// MT - Machine Translation
async function mt(endpoint: string, sourceLang: string, targetLang: string, text: string): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': API_KEY,
    },
    body: JSON.stringify({
      input_text: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`MT failed: ${response.statusText}`);
  }

  const result: MTResponse = await response.json();
  return result.data.output_text;
}

// TTS - Text to Speech
async function tts(endpoint: string, languageCode: string, text: string): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': API_KEY,
    },
    body: JSON.stringify({
      text: text,
      gender: 'female',
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS failed: ${response.statusText}`);
  }

  const result: TTSResponse = await response.json();
  return result.data.s3_url;
}

// Helper function to convert audio to WAV format
async function convertToWav(blob: Blob): Promise<Blob> {
  try {
    console.log('Converting to WAV format...');
    const audioContext = new AudioContext({ sampleRate: 16000 }); // 16kHz sample rate
    const arrayBuffer = await blob.arrayBuffer();
    console.log('Array buffer size:', arrayBuffer.byteLength);
    
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log('Audio decoded - channels:', audioBuffer.numberOfChannels, 'duration:', audioBuffer.duration);
    
    // Convert to WAV format
    const wavBuffer = audioBufferToWav(audioBuffer);
    console.log('WAV buffer created, size:', wavBuffer.byteLength);
    
    await audioContext.close();
    return new Blob([wavBuffer], { type: 'audio/wav' });
  } catch (error) {
    console.error('Audio conversion error:', error);
    throw new Error(`Failed to convert audio to WAV: ${error}`);
  }
}

// Convert AudioBuffer to WAV format
function audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const data = new Float32Array(audioBuffer.length * numChannels);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < audioBuffer.length; i++) {
      data[i * numChannels + channel] = channelData[i];
    }
  }
  
  const dataLength = data.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  // Write audio data
  floatTo16BitPCM(view, 44, data);
  
  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

// Language pair configurations
const LANGUAGE_CONFIGS = {
  'te-en': {
    asr: 'https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67b840e29c21bec07537674b',
    asrLang: 'te-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/688fbcc58a64d68b8ea93931',
    mtSource: 'te',
    mtTarget: 'en',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca8b3e0b95a6a1ea34a93',
    ttsLang: 'en-IN',
  },
  'en-te': {
    asr: 'https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67127dcbb1a6984f0c5e7d35',
    asrLang: 'en-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316389a',
    mtSource: 'en',
    mtTarget: 'te',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67b842f39c21bec07537674e',
    ttsLang: 'te-IN',
  },
  'en-hi': {
    asr: 'https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67127dcbb1a6984f0c5e7d35',
    asrLang: 'en-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316383c',
    mtSource: 'en',
    mtTarget: 'hi',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca89ae0b95a6a1ea34a92',
    ttsLang: 'hi-IN',
  },
  'hi-en': {
    asr: 'https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67100d22a0397bc812dacb27',
    asrLang: 'hi-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316384a',
    mtSource: 'hi',
    mtTarget: 'en',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca8b3e0b95a6a1ea34a93',
    ttsLang: 'en-IN',
  },
  'hi-te': {
    asr: 'https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67100d22a0397bc812dacb27',
    asrLang: 'hi-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316388e',
    mtSource: 'hi',
    mtTarget: 'te',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67b842f39c21bec07537674e',
    ttsLang: 'te-IN',
  },
  'te-hi': {
    asr: 'https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67b840e29c21bec07537674b',
    asrLang: 'te-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb923163897',
    mtSource: 'te',
    mtTarget: 'hi',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca89ae0b95a6a1ea34a92',
    ttsLang: 'hi-IN',
  },
};

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  translatedAudioUrl: string;
}

export async function translateSpeechToSpeech(
  audioBlob: Blob,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> {
  const configKey = `${sourceLanguage}-${targetLanguage}` as keyof typeof LANGUAGE_CONFIGS;
  const config = LANGUAGE_CONFIGS[configKey];

  if (!config) {
    throw new Error(`Unsupported language pair: ${sourceLanguage} to ${targetLanguage}`);
  }

  // Step 1: Speech to Text (ASR)
  const sourceText = await asr(config.asr, config.asrLang, audioBlob);
  
  // Step 2: Translate Text (MT)
  const translatedText = await mt(config.mt, config.mtSource, config.mtTarget, sourceText);
  
  // Step 3: Text to Speech (TTS)
  const translatedAudioUrl = await tts(config.tts, config.ttsLang, translatedText);

  return {
    sourceText,
    translatedText,
    translatedAudioUrl,
  };
}
