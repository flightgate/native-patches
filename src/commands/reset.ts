import { removeGitRepo } from '../helpers/git';
import { getTargetsInfo } from '../helpers/targets';
import { i18n } from '../i18n';
import type { Target } from '../types';

export const resetCommand = (target: Target) => {
  console.log(i18n.t('commands.reset'));
  console.log();

  const { folders } = getTargetsInfo(target);

  folders.forEach((folder) => {
    removeGitRepo(folder);
  });

  console.log(i18n.t('success.reset'));

  process.exit(0);
};
