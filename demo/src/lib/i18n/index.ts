import { Language } from '../types/lesson';

export const en = {
  'common.start': 'Start Lesson',
  'common.next': 'Next',
  'common.back': 'Back',
  'common.finish': 'Finish',
  'common.language': 'Language',
  'common.test_missing_key_in_hi': 'Missing Hindi',
  'mission.physics.title': 'Electromagnetic Induction',
  'mission.physics.desc': 'Move a conductor through a magnetic field to generate electricity',
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
  'mission.physics.title': 'विद्युत चुम्बकीय प्रेरण',
  'mission.physics.desc': 'चुंबकीय क्षेत्र के माध्यम से कंडक्टर को घुमाकर बिजली उत्पन्न करें',
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

export function useTranslations(lang: Language) {
  return {
    t: (key: TranslationKey) => getTranslation(key, lang),
  };
}
