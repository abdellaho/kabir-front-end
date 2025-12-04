import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly LANG_KEY = 'selectedLanguage';
  supportedLanguages = [ 'fr', 'en', 'ar'];
  private languageSubject = new BehaviorSubject<string>('fr');
  selectedLanguage$ = this.languageSubject.asObservable(); // Observable for components to subscribe if needed

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  initLanguage() {
    const savedLang = localStorage.getItem(this.LANG_KEY);
    const defaultLang = savedLang && this.supportedLanguages.includes(savedLang) ? savedLang : 'fr';
    this.translate.setDefaultLang('fr'); // Fallback language
    this.setLanguage(defaultLang);
  }

  setLanguage(lang: string) {
    if (this.supportedLanguages.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem(this.LANG_KEY, lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    } else {
      console.warn(`Language ${lang} is not supported.`);
    }
  }

  getCurrentLanguage(): string {
    return this.languageSubject.getValue();
  }
}