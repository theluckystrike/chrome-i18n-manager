/**
 * I18n Manager — Dynamic language switching with interpolation and pluralization
 */
export class I18nManager {
    private translations = new Map<string, Record<string, string>>();
    private currentLocale = 'en';
    private fallbackLocale = 'en';
    private listeners: Array<(locale: string) => void> = [];

    /** Add translations for a locale */
    addLocale(locale: string, messages: Record<string, string>): this {
        this.translations.set(locale, { ...(this.translations.get(locale) || {}), ...messages });
        return this;
    }

    /** Set current locale */
    setLocale(locale: string): void {
        this.currentLocale = locale;
        this.listeners.forEach((fn) => fn(locale));
    }

    /** Get current locale */
    getLocale(): string { return this.currentLocale; }

    /** Translate a key with optional interpolation */
    t(key: string, params?: Record<string, string | number>): string {
        const messages = this.translations.get(this.currentLocale) || this.translations.get(this.fallbackLocale) || {};
        let text = messages[key] || key;
        if (params) Object.entries(params).forEach(([k, v]) => { text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)); });
        return text;
    }

    /** Pluralize */
    plural(key: string, count: number, params?: Record<string, string | number>): string {
        const suffix = count === 0 ? '_zero' : count === 1 ? '_one' : '_other';
        return this.t(key + suffix, { count, ...params });
    }

    /** Get available locales */
    getLocales(): string[] { return Array.from(this.translations.keys()); }

    /** Check if key exists */
    has(key: string): boolean {
        const messages = this.translations.get(this.currentLocale);
        return !!messages?.[key];
    }

    /** Detect browser locale */
    static detectLocale(): string { return chrome.i18n.getUILanguage().split('-')[0] || 'en'; }

    /** Auto-detect and set locale */
    autoDetect(): this { this.setLocale(I18nManager.detectLocale()); return this; }

    /** Listen for locale changes */
    onChange(callback: (locale: string) => void): () => void {
        this.listeners.push(callback);
        return () => { this.listeners = this.listeners.filter((fn) => fn !== callback); };
    }

    /** Save locale preference */
    async savePreference(): Promise<void> { await chrome.storage.local.set({ __i18n_locale__: this.currentLocale }); }

    /** Load locale preference */
    async loadPreference(): Promise<void> {
        const result = await chrome.storage.local.get('__i18n_locale__');
        if (result.__i18n_locale__) this.setLocale(result.__i18n_locale__);
    }
}
