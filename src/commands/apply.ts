import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { config } from '../helpers/config';
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
      ? readdirSync(folderPatchesDir)
          .filter((f) => f.endsWith('.patch'))
          .sort()
      : [];

    if (patches.length === 0) {
      console.error(i18n.t('warnings.noPatchesFound', { folder }));
      console.log();
      console.log();

      return;
    }

    initGitRepo(folder);

    console.log();
    console.log(
      i18n.t('commands.applyByTarget', { count: patches.length, folder }),
    );
    console.log();

    patches.forEach((patch) => {
      const patchPath = path.resolve(patchesDir, folder, patch);

      try {
        try {
          execSync(`git apply --reverse --check "${patchPath}"`, {
            cwd: folder,
            stdio: 'pipe',
          });

          // TODO: move "(already applied)" to translate
          console.log(
            i18n.t('success.appliedPatch', {
              patch: `${patch} (already applied)`,
            }),
          );

          totalApplied++;
          // Patch is not applied yet, continue normally
        } catch {
          execSync(`git apply "${patchPath}"`, {
            cwd: folder,
            stdio: config.stdio,
          });

          console.log(i18n.t('success.appliedPatch', { patch }));

          totalApplied++;
        }
      } catch {
        console.error(i18n.t('errors.notAppliedPatch', { patch }));

        totalFailed++;
      }
    });

    // Add two empty lines to separate the targets.
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
