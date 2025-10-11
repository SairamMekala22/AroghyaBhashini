import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  doctorLanguage: string;
  patientLanguage: string;
  setDoctorLanguage: (lang: string) => void;
  setPatientLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctorLanguage, setDoctorLanguage] = useState('en');
  const [patientLanguage, setPatientLanguage] = useState('hi');

  return (
    <LanguageContext.Provider
      value={{
        doctorLanguage,
        patientLanguage,
        setDoctorLanguage,
        setPatientLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
