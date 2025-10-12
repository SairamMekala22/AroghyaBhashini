import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BHASHINI_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTZmNjRiOTNlM2JlYzkwMWZkYTViIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.q6HNVdL8UxUSMBR6Mj7K1HNnzD5Dw3DGG79v8RSS_ic';

const LANGUAGE_CONFIGS: Record<string, any> = {
  'en': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f420802ae0a1948845594',
    ocrLang: 'en-IN',
    mt: '',
    mtSource: 'en',
    mtTarget: 'en',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca8b3e0b95a6a1ea34a93',
    ttsLang: 'en-IN',
  },
  'te': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f420802ae0a1948845594',
    ocrLang: 'en-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316389a',
    mtSource: 'en',
    mtTarget: 'te',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67b842f39c21bec07537674e',
    ttsLang: 'te-IN',
  },
  'hi': {
    ocr: 'https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f420802ae0a1948845594',
    ocrLang: 'en-IN',
    mt: 'https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316383c',
    mtSource: 'en',
    mtTarget: 'hi',
    tts: 'https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca89ae0b95a6a1ea34a92',
    ttsLang: 'hi-IN',
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, language } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    const config = LANGUAGE_CONFIGS[language] || LANGUAGE_CONFIGS['en'];
    console.log('Processing with language:', language, 'config:', config);

    // Step 1: OCR - Extract text from image
    console.log('Step 1: Starting OCR...');
    const imageBuffer = Uint8Array.from(atob(image), c => c.charCodeAt(0));
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    
    const ocrFormData = new FormData();
    ocrFormData.append('file', blob, 'report.jpg');

    const ocrResponse = await fetch(config.ocr, {
      method: 'POST',
      headers: {
        'access-token': BHASHINI_API_KEY,
      },
      body: ocrFormData,
    });

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      console.error('OCR error:', errorText);
      throw new Error(`OCR failed: ${errorText}`);
    }

    const ocrResult = await ocrResponse.json();
    const extractedText = ocrResult.data?.decoded_text || ocrResult.data?.recognized_text;
    console.log('OCR completed. Extracted text length:', extractedText?.length);

    if (!extractedText) {
      throw new Error('No text extracted from image');
    }

    // Step 2: Summarize with Gemini
    console.log('Step 2: Summarizing with AI...');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const summaryResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a medical report summarization assistant. Provide clear, concise summaries of medical reports in simple language that patients can understand. Keep summaries under 30 words for text-to-speech conversion.'
          },
          {
            role: 'user',
            content: `Summarize this medical report in simple terms (max 30 words): ${extractedText}`
          }
        ],
      }),
    });

    if (!summaryResponse.ok) {
      const errorText = await summaryResponse.text();
      console.error('Summary error:', errorText);
      throw new Error(`Summarization failed: ${errorText}`);
    }

    const summaryResult = await summaryResponse.json();
    let summary = summaryResult.choices[0].message.content;
    console.log('Summary completed:', summary);

    // Step 3: Translate if needed (not English)
    let translatedText = summary;
    if (language !== 'en' && config.mt) {
      console.log('Step 3: Translating to', language);
      
      const mtResponse = await fetch(config.mt, {
        method: 'POST',
        headers: {
          'access-token': BHASHINI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: summary,
        }),
      });

      if (!mtResponse.ok) {
        const errorText = await mtResponse.text();
        console.error('Translation error:', errorText);
        throw new Error(`Translation failed: ${errorText}`);
      }

      const mtResult = await mtResponse.json();
      translatedText = mtResult.data?.output_text || summary;
      console.log('Translation completed');
    } else {
      console.log('Step 3: Skipping translation (English selected)');
    }

    // Step 4: Text-to-Speech
    console.log('Step 4: Converting to speech...');
    
    // Clean text for TTS (remove special characters)
    const cleanText = translatedText.replace(/[^\w\s\u0900-\u097F\u0C00-\u0C7F]/g, '');
    
    const ttsResponse = await fetch(config.tts, {
      method: 'POST',
      headers: {
        'access-token': BHASHINI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanText,
        gender: 'female',
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('TTS error:', errorText);
      throw new Error(`Text-to-speech failed: ${errorText}`);
    }

    const ttsResult = await ttsResponse.json();
    const audioUrl = ttsResult.data?.s3_url;
    console.log('TTS completed. Audio URL:', audioUrl);

    if (!audioUrl) {
      throw new Error('No audio URL received from TTS service');
    }

    return new Response(
      JSON.stringify({
        success: true,
        audioUrl,
        summary,
        translatedText: language !== 'en' ? translatedText : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in process-medical-report:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
