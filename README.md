# chrome-i18n-manager — Dynamic Internationalization
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-i18n-manager`

Dynamic locale switching, interpolation `{{name}}`, pluralization, auto-detect, and preference persistence.

```typescript
import { I18nManager } from 'chrome-i18n-manager';
const i18n = new I18nManager();
i18n.addLocale('en', { greeting: 'Hello {{name}}', items_one: '1 item', items_other: '{{count}} items' });
i18n.addLocale('es', { greeting: 'Hola {{name}}' });
i18n.autoDetect();
i18n.t('greeting', { name: 'World' }); // "Hello World"
```
MIT License
