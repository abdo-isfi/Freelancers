import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

/**
 * Language Toggle Component
 * Switches between English (EN) and French (FR)
 * Uses react-i18next for actual translation
 */
export function LanguageToggle({ className }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.toUpperCase();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300',
        'bg-[rgba(31,31,31,0.62)] border-[#333]',
        'hover:border-white/50 hover:bg-[rgba(31,31,31,0.8)]',
        'text-gray-300 hover:text-white',
        className
      )}
      aria-label={`Switch to ${i18n.language === 'en' ? 'French' : 'English'}`}
      title={`Switch to ${i18n.language === 'en' ? 'Français' : 'English'}`}
    >
      <Languages className="w-4 h-4" />
      <span className="text-xs font-semibold">{currentLang}</span>
    </button>
  );
}

