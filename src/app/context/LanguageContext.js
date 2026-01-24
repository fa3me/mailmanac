'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { dictionary } from '../../locales/dictionary';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Default to English, but try to read from localStorage client-side
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('mailmanac_lang');
        if (savedLang && dictionary[savedLang]) {
            setLanguage(savedLang);
        }
    }, []);

    const changeLanguage = (lang) => {
        if (dictionary[lang]) {
            setLanguage(lang);
            localStorage.setItem('mailmanac_lang', lang);

            // Handle RTL for Arabic
            if (lang === 'ar') {
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = 'ar';
            } else {
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = lang;
            }
        }
    };

    // Translation function
    const t = (key) => {
        const keys = key.split('.');
        let value = dictionary[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key; // Fallback to key if not found
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
