import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { initGitRepo, removeGitRepo } from '../helpers/git';
import { getTargetsInfo } from '../helpers/targets';
import { i18n } from '../i18n';
import type { Target } from '../types';

export const applyCommand = (target: Target) => {
  console.log(i18n.t('commands.apply'));
  console.log();

  const patchesDir = 'native-patches';

  if (!existsSync(patchesDir)) {
    console.error(i18n.t('warnings.noPatchesFound'));
    process.exit(0);
  }

  const { folders } = getTargetsInfo(target);

  for (const folder of folders) {
    if (!existsSync(folder)) {
      console.error(i18n.t('errors.noAndroidOrIosFolders'));
      process.exit(0);
    }
  }

  let totalApplied = 0;
  let totalFailed = 0;

  folders.forEach((folder) => {
    const folderPatchesDir = path.join(patchesDir, folder);

    const patches = existsSync(folderPatchesDir)
      ? readdirSync(folderPatchesDir).filter((f) => f.endsWith('.patch')).sort()
      : [];

    if (patches.length === 0) {
      console.error(i18n.t('warnings.noPatchesFound', { folder }));
      console.log();
      console.log();

      return;
    }

    initGitRepo(folder);

    console.log();
    console.log(i18n.t('commands.applyByTarget', { count: patches.length, folder }));

    patches.forEach((patch: string) => {
      const patchPath = path.resolve(patchesDir, folder, patch);

      try {
        execSync(`git apply "${patchPath}"`, {
          cwd: folder,
          stdio: 'pipe',
        });

        console.log(i18n.t('success.appliedPatch', { patch }));

        totalApplied++;
      } catch {
        console.error(i18n.t('errors.notAppliedPatch', { patch }));

        totalFailed++;
      }
    });

    console.log();
    console.log();

    removeGitRepo(folder);
  });

  if (totalFailed === 0) {
    console.log(i18n.t('success.apply', { count: totalApplied }));
    process.exit(0);
  }

  console.log(i18n.t('errors.failedToApply', { count: totalFailed }));
  process.exit(0);
};
