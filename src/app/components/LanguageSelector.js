'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export default function LanguageSelector() {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn glass"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    height: '40px',
                    minWidth: 'unset'
                }}
            >
                <span style={{ fontSize: '1.2rem' }}>{currentLang.flag}</span>
                <span style={{ fontSize: '0.9rem', display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                    {currentLang.code.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>▼</span>
            </button>

            {isOpen && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="card glass" style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        minWidth: '160px',
                        zIndex: 50,
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: language === lang.code ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '0.95rem'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => {
                                    if (language !== lang.code) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
