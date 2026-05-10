import { I18n } from 'i18n-js';
import { en } from './locales/en';
import chalk from 'chalk';

const _i18n = new I18n({ en });

_i18n.locale = 'en';
_i18n.enableFallback = true;
_i18n.defaultLocale = 'en';

const icons = {
    error: chalk.red('X'),
    warning: chalk.yellow('!'),
    success: chalk.green('✔'),
};

export const i18n = {
    t: (key: string, options?: object) => {
        return _i18n.t(key, options)
            .replace(/\{error\}/g, icons.error)
            .replace(/\{warning\}/g, icons.warning)
            .replace(/\{success\}/g, icons.success)
    }
};