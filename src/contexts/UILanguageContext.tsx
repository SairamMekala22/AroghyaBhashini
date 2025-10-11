import React, { createContext, useContext, useState } from 'react';

type UILanguage = 'en' | 'hi' | 'te';

interface UILanguageContextType {
  uiLanguage: UILanguage;
  setUILanguage: (lang: UILanguage) => void;
  t: (key: string) => string;
}

const translations: Record<UILanguage, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.conversation': 'Conversation',
    'nav.prescription': 'Prescription',
    'nav.medications': 'My Medications',
    
    // Home Page
    'home.tagline': 'Breaking Language Barriers in Healthcare',
    'home.subtitle': 'Seamless communication between doctors and patients in multiple languages',
    'home.start': 'Start Conversation',
    'home.features': 'Key Features',
    'home.feature1.title': 'Real-Time Translation',
    'home.feature1.desc': 'Instant speech-to-speech translation between doctor and patient',
    'home.feature2.title': 'Prescription Scanner',
    'home.feature2.desc': 'Upload and translate medical prescriptions with audio support',
    'home.feature3.title': 'Medicine Reminders',
    'home.feature3.desc': 'Track medications and get timely dosage reminders',
    
    // Conversation Page
    'conv.title': 'Live Conversation',
    'conv.subtitle': 'Real-time speech translation between doctor and patient',
    'conv.settings': 'Language Settings',
    'conv.doctor': 'Doctor Language',
    'conv.patient': 'Patient Language',
    'conv.chat': 'Translation Chat',
    'conv.empty': 'No messages yet. Start recording to begin the conversation.',
    'conv.record': 'Recording',
    'conv.stop': 'Stop & Translate',
    'conv.start': 'Start Recording',
    'conv.processing': 'Processing audio...',
    
    // Prescription Page
    'rx.title': 'Prescription Translator',
    'rx.subtitle': 'Upload medical prescriptions and get instant translations',
    'rx.settings': 'Translation Settings',
    'rx.from': 'From (Prescription Language)',
    'rx.to': 'To (Your Language)',
    'rx.upload': 'Upload & Translate',
    'rx.drag': 'Click to upload or drag and drop',
    'rx.formats': 'PNG, JPG (MAX. 10MB)',
    'rx.translate': 'Translate Prescription',
    'rx.translating': 'Translating...',
    'rx.original': 'Original Text',
    'rx.translated': 'Translated Text',
    'rx.listen': 'Listen to Translation',
    
    // Medications Page
    'med.title': 'My Medications',
    'med.subtitle': 'Track your prescribed medicines and dosages',
    'med.empty': 'No medications added yet',
    'med.dosage': 'Dosage',
    'med.frequency': 'Frequency',
    'med.next': 'Next Alert',
    'med.taken': 'Mark as Taken',
    'med.loading': 'Loading medications...',
  },
  hi: {
    // Navbar
    'nav.home': 'होम',
    'nav.conversation': 'बातचीत',
    'nav.prescription': 'प्रिस्क्रिप्शन',
    'nav.medications': 'मेरी दवाएं',
    
    // Home Page
    'home.tagline': 'स्वास्थ्य सेवा में भाषा की बाधाओं को तोड़ना',
    'home.subtitle': 'कई भाषाओं में डॉक्टरों और रोगियों के बीच सहज संचार',
    'home.start': 'बातचीत शुरू करें',
    'home.features': 'मुख्य विशेषताएं',
    'home.feature1.title': 'रियल-टाइम अनुवाद',
    'home.feature1.desc': 'डॉक्टर और रोगी के बीच तत्काल वाक्-से-वाक् अनुवाद',
    'home.feature2.title': 'प्रिस्क्रिप्शन स्कैनर',
    'home.feature2.desc': 'ऑडियो समर्थन के साथ चिकित्सा प्रिस्क्रिप्शन अपलोड और अनुवाद करें',
    'home.feature3.title': 'दवा अनुस्मारक',
    'home.feature3.desc': 'दवाओं को ट्रैक करें और समय पर खुराक की याद दिलाएं',
    
    // Conversation Page
    'conv.title': 'लाइव बातचीत',
    'conv.subtitle': 'डॉक्टर और रोगी के बीच रियल-टाइम भाषण अनुवाद',
    'conv.settings': 'भाषा सेटिंग्स',
    'conv.doctor': 'डॉक्टर की भाषा',
    'conv.patient': 'रोगी की भाषा',
    'conv.chat': 'अनुवाद चैट',
    'conv.empty': 'अभी तक कोई संदेश नहीं। बातचीत शुरू करने के लिए रिकॉर्डिंग शुरू करें।',
    'conv.record': 'रिकॉर्ड कर रहे हैं',
    'conv.stop': 'रोकें और अनुवाद करें',
    'conv.start': 'रिकॉर्डिंग शुरू करें',
    'conv.processing': 'ऑडियो प्रोसेस हो रहा है...',
    
    // Prescription Page
    'rx.title': 'प्रिस्क्रिप्शन अनुवादक',
    'rx.subtitle': 'चिकित्सा प्रिस्क्रिप्शन अपलोड करें और तत्काल अनुवाद प्राप्त करें',
    'rx.settings': 'अनुवाद सेटिंग्स',
    'rx.from': 'से (प्रिस्क्रिप्शन भाषा)',
    'rx.to': 'तक (आपकी भाषा)',
    'rx.upload': 'अपलोड और अनुवाद करें',
    'rx.drag': 'अपलोड करने के लिए क्लिक करें या ड्रैग और ड्रॉप करें',
    'rx.formats': 'PNG, JPG (अधिकतम 10MB)',
    'rx.translate': 'प्रिस्क्रिप्शन का अनुवाद करें',
    'rx.translating': 'अनुवाद हो रहा है...',
    'rx.original': 'मूल पाठ',
    'rx.translated': 'अनुवादित पाठ',
    'rx.listen': 'अनुवाद सुनें',
    
    // Medications Page
    'med.title': 'मेरी दवाएं',
    'med.subtitle': 'अपनी निर्धारित दवाओं और खुराक को ट्रैक करें',
    'med.empty': 'अभी तक कोई दवा नहीं जोड़ी गई',
    'med.dosage': 'खुराक',
    'med.frequency': 'आवृत्ति',
    'med.next': 'अगली अलर्ट',
    'med.taken': 'लिया हुआ चिह्नित करें',
    'med.loading': 'दवाएं लोड हो रही हैं...',
  },
  te: {
    // Navbar
    'nav.home': 'హోమ్',
    'nav.conversation': 'సంభాషణ',
    'nav.prescription': 'ప్రిస్క్రిప్షన్',
    'nav.medications': 'నా మందులు',
    
    // Home Page
    'home.tagline': 'ఆరోగ్య సంరక్షణలో భాషా అడ్డంకులను తొలగించడం',
    'home.subtitle': 'బహుళ భాషలలో వైద్యులు మరియు రోగుల మధ్య సజావుగా సంభాషణ',
    'home.start': 'సంభాషణ ప్రారంభించండి',
    'home.features': 'ముఖ్య లక్షణాలు',
    'home.feature1.title': 'రియల్-టైమ్ అనువాదం',
    'home.feature1.desc': 'వైద్యుడు మరియు రోగి మధ్య తక్షణ ప్రసంగ అనువాదం',
    'home.feature2.title': 'ప్రిస్క్రిప్షన్ స్కానర్',
    'home.feature2.desc': 'ఆడియో మద్దతుతో వైద్య ప్రిస్క్రిప్షన్లను అప్‌లోడ్ చేసి అనువదించండి',
    'home.feature3.title': 'మందుల రిమైండర్లు',
    'home.feature3.desc': 'మందులను ట్రాక్ చేయండి మరియు సకాలంలో మోతాదు రిమైండర్లు పొందండి',
    
    // Conversation Page
    'conv.title': 'లైవ్ సంభాషణ',
    'conv.subtitle': 'వైద్యుడు మరియు రోగి మధ్య రియల్-టైమ్ ప్రసంగ అనువాదం',
    'conv.settings': 'భాషా సెట్టింగ్‌లు',
    'conv.doctor': 'వైద్యుడి భాష',
    'conv.patient': 'రోగి భాష',
    'conv.chat': 'అనువాద చాట్',
    'conv.empty': 'ఇంకా సందేశాలు లేవు. సంభాషణ ప్రారంభించడానికి రికార్డింగ్ ప్రారంభించండి.',
    'conv.record': 'రికార్డ్ చేస్తోంది',
    'conv.stop': 'ఆపండి & అనువదించండి',
    'conv.start': 'రికార్డింగ్ ప్రారంభించండి',
    'conv.processing': 'ఆడియో ప్రాసెస్ అవుతోంది...',
    
    // Prescription Page
    'rx.title': 'ప్రిస్క్రిప్షన్ అనువాదకుడు',
    'rx.subtitle': 'వైద్య ప్రిస్క్రిప్షన్లను అప్‌లోడ్ చేసి తక్షణ అనువాదాలు పొందండి',
    'rx.settings': 'అనువాద సెట్టింగ్‌లు',
    'rx.from': 'నుండి (ప్రిస్క్రిప్షన్ భాష)',
    'rx.to': 'కు (మీ భాష)',
    'rx.upload': 'అప్‌లోడ్ & అనువదించండి',
    'rx.drag': 'అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి లేదా డ్రాగ్ అండ్ డ్రాప్ చేయండి',
    'rx.formats': 'PNG, JPG (గరిష్టం 10MB)',
    'rx.translate': 'ప్రిస్క్రిప్షన్‌ను అనువదించండి',
    'rx.translating': 'అనువదిస్తోంది...',
    'rx.original': 'అసలు టెక్స్ట్',
    'rx.translated': 'అనువదించబడిన టెక్స్ట్',
    'rx.listen': 'అనువాదం వినండి',
    
    // Medications Page
    'med.title': 'నా మందులు',
    'med.subtitle': 'మీ సూచించిన మందులు మరియు మోతాదులను ట్రాక్ చేయండి',
    'med.empty': 'ఇంకా మందులు జోడించబడలేదు',
    'med.dosage': 'మోతాదు',
    'med.frequency': 'తరచుదనం',
    'med.next': 'తదుపరి హెచ్చరిక',
    'med.taken': 'తీసుకున్నట్లు గుర్తించండి',
    'med.loading': 'మందులు లోడ్ అవుతున్నాయి...',
  },
};

const UILanguageContext = createContext<UILanguageContextType | undefined>(undefined);

export const UILanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiLanguage, setUILanguage] = useState<UILanguage>('en');

  const t = (key: string): string => {
    return translations[uiLanguage][key] || key;
  };

  return (
    <UILanguageContext.Provider value={{ uiLanguage, setUILanguage, t }}>
      {children}
    </UILanguageContext.Provider>
  );
};

export const useUILanguage = () => {
  const context = useContext(UILanguageContext);
  if (context === undefined) {
    throw new Error('useUILanguage must be used within a UILanguageProvider');
  }
  return context;
};
