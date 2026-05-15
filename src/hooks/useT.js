import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import { en } from '../translations/en'
import { es } from '../translations/es'

const translations = { en, es }

export function useT(namespace) {
  const { lang } = useContext(LanguageContext)
  return translations[lang]?.[namespace] ?? translations['en'][namespace]
}
