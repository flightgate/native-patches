import chalk from 'chalk';
import { I18n } from 'i18n-js';
import { en } from './locales/en';

const _i18n = new I18n({ en });

_i18n.locale = 'en';
_i18n.enableFallback = true;
_i18n.defaultLocale = 'en';

const icons = () => ({
  error: chalk.red('X'),
  warning: chalk.yellow('!'),
  success: chalk.green('✔'),
});

export const i18n = {
  t: (key: string, options?: object) => {
    const { error, warning, success } = icons();

    return _i18n
      .t(key, options)
      .replace(/\{error\}/g, error)
      .replace(/\{warning\}/g, warning)
      .replace(/\{success\}/g, success);
  },
};
