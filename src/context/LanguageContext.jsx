import { createContext, useContext, useState } from 'react'

export const LanguageContext = createContext({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('jj-lang') ?? 'en')

  function toggle(newLang) {
    setLang(newLang)
    localStorage.setItem('jj-lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
