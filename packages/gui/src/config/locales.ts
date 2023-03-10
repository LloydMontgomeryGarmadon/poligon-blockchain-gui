import { i18n } from '@lingui/core';
import {
  en,
} from 'make-plural/plurals';
import * as coreLocales from '@poligon/core/src/locales';
import * as walletsLocales from '@poligon/wallets/src/locales';
import * as guiLocales from '../locales';

export const defaultLocale = 'en-US';

// https://www.codetwo.com/admins-blog/list-of-office-365-language-id/
// https://www.venea.net/web/culture_code
export const locales = [
  {
    locale: 'en-US',
    label: 'English',
  },
];

i18n.loadLocaleData('en-US', { plurals: en });

locales.forEach(({ locale }) => {
  const importName = locale.replace('-', '');

  const messages = {
    ...coreLocales[importName].messages,
    ...walletsLocales[importName].messages,
    ...guiLocales[importName].messages,
  };

  i18n.load(locale, messages);
});

export { i18n };
