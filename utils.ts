
import { Language } from './types';
import { TRANSLATIONS } from './constants';

export const getTranslation = (lang: Language, path: string) => {
  const parts = path.split('.');
  let current: any = TRANSLATIONS[lang];
  for (const part of parts) {
    if (current[part] === undefined) return path;
    current = current[part];
  }
  return current;
};

export const formatTimeAgo = (dateString: string, lang: Language) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return lang === Language.ENGLISH ? 'Just now' : 'आत्ताच';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} ${lang === Language.ENGLISH ? 'm ago' : 'मि. पूर्वी'}`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${lang === Language.ENGLISH ? 'h ago' : 'तास पूर्वी'}`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${lang === Language.ENGLISH ? 'd ago' : 'दिवस पूर्वी'}`;
};

export const getTimeToFix = (createdAt: string, fixedAt?: string): string => {
  const start = new Date(createdAt);
  const end = fixedAt ? new Date(fixedAt) : new Date();
  const diff = end.getTime() - start.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
