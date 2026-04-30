import { Language } from '../types/lesson';

export const en = {
  'common.start': 'Start Lesson',
  'common.next': 'Next',
  'common.back': 'Back',
  'common.finish': 'Finish',
  'common.language': 'Language',
  'common.test_missing_key_in_hi': 'Missing Hindi',
  'mission.physics.title': 'Magnetic Magic',
  'mission.physics.desc': 'Move a magnet to create electricity',
  'mission.chemistry.title': 'The Color of pH',
  'mission.chemistry.desc': 'Mix everyday liquids and watch the color change',
  'mission.biology.title': 'Blood Flow Journey',
  'mission.biology.desc': 'Follow a red blood cell through the body',
};

export const hi: Partial<Record<keyof typeof en, string>> = {
  'common.start': 'पाठ शुरू करें',
  'common.next': 'अगला',
  'common.back': 'पीछे',
  'common.finish': 'समाप्त',
  'common.language': 'भाषा',
  'mission.physics.title': 'चुंबकीय जादू',
  'mission.physics.desc': 'बिजली बनाने के लिए चुंबक को हिलाएं',
  'mission.chemistry.title': 'पीएच का रंग',
  'mission.chemistry.desc': 'रोजमर्रा के तरल पदार्थों को मिलाएं और रंग बदलते देखें',
  'mission.biology.title': 'रक्त प्रवाह यात्रा',
  'mission.biology.desc': 'शरीर के माध्यम से एक लाल रक्त कोशिका का पालन करें',
};

export type TranslationKey = keyof typeof en;

export function getTranslation(key: TranslationKey, lang: Language): string {
  if (lang === 'hi') {
    return hi[key] ?? en[key] ?? String(key);
  }
  return en[key] ?? String(key);
}
