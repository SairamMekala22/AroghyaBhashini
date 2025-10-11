import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Speech Translation API
export const translateSpeech = async (
  audioFile: File,
  sourceLanguage: string,
  targetLanguage: string
) => {
  const formData = new FormData();
  formData.append('audio_file', audioFile);
  formData.append('source_lang', sourceLanguage);
  formData.append('target_lang', targetLanguage);

  const response = await apiClient.post('/translate_speech', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Image/Document Translation API
export const translateImage = async (
  imageFile: File,
  sourceLanguage: string,
  targetLanguage: string
) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('source_lang', sourceLanguage);
  formData.append('target_lang', targetLanguage);

  const response = await apiClient.post('/translate_image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Medicine Reminder APIs
export const getMedicines = async () => {
  const response = await apiClient.get('/get_medicines');
  return response.data;
};

export const addMedicine = async (medicineData: {
  name: string;
  dosage: string;
  frequency: string;
  nextAlert: string;
}) => {
  const response = await apiClient.post('/add_medicine', medicineData);
  return response.data;
};

export const markMedicineTaken = async (medicineId: string) => {
  const response = await apiClient.post(`/mark_taken/${medicineId}`);
  return response.data;
};

export default apiClient;
