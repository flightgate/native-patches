import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { config } from '../helpers/config';
import { createFolder } from '../helpers/fs';
import { getNewFiles, hasChanges, removeGitRepo } from '../helpers/git';
import { getTargetsInfo } from '../helpers/targets';
import { i18n } from '../i18n';
import type { Target } from '../types';

export const generateCommand = (target: Target, name: string): void => {
  console.log(i18n.t('commands.generate'));
  console.log();

  const { foldersWithoutGit, folders } = getTargetsInfo(target);

  if (foldersWithoutGit.length > 0) {
    console.error(
      i18n.t('errors.hasNotInitialized', {
        folder: foldersWithoutGit.join(' and '),
      }),
    );
    process.exit(1);
  }

  createFolder('native-patches');

  let totalPatches = 0;

  folders.forEach((folder) => {
    const options = { cwd: folder, stdio: config.stdio };

    if (!hasChanges(folder)) {
      console.error(i18n.t('warnings.noChanges', { folder }));

      removeGitRepo(folder);

      return;
    }

    createFolder(`native-patches/${folder}`);

    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, '')
      .replace(/[-T]/g, '_');

    const newXcodeFiles =
      folder === 'ios'
        ? getNewFiles(folder, ['.swift', '.m', '.mm', '.h'])
        : [];

    execSync('git add -A', options);
    execSync('git diff --staged > patch.diff', options);

    const baseName = `${timestamp}-${name}`;

    execSync(
      `mv patch.diff ../native-patches/${folder}/${baseName}.patch`,
      options,
    );

    if (newXcodeFiles.length > 0) {
      writeFileSync(
        path.join('native-patches', folder, `${baseName}.xcode-files`),
        newXcodeFiles.join('\n'),
      );
    }

    removeGitRepo(folder);

    totalPatches++;
  });

  console.log();
  console.log(i18n.t('success.generate', { count: totalPatches }));
};
