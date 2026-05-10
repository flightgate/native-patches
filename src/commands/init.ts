import { getCommitCount, initGitRepo } from '../helpers/git';
import { getTargetsInfo } from '../helpers/targets';
import { askConfirmation, runWithSpinner } from '../helpers/ui';
import { i18n } from '../i18n';
import type { SpinnerStep, Target } from '../types';
import { spawn } from 'node:child_process';

export const execAsync = (command: string, args: string[], cwd: string) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('close', (code) => {
      code === 0 ? resolve() : reject(new Error(`Exited with code ${code}`));
    });
  });

export const initCommand = async (
  target: Target,
  clean: boolean,
): Promise<void> => {
  console.log(i18n.t('commands.init'));
  console.log();

  const { foldersWithGit, folders } = getTargetsInfo(target);

  if (clean && foldersWithGit.length > 0) {
    const confirmed = await askConfirmation(
      i18n.t('warnings.hasChanges', {
        folder: foldersWithGit.join(' and '),
      }),
    );

    if (!confirmed) {
      console.log();
      console.error(i18n.t('errors.resetOperation'));
      process.exit(0);
    }
  }

  if (!clean && foldersWithGit.length > 0) {
    const hasCommits = foldersWithGit.some(
      (folder) => getCommitCount(folder) > 0,
    );

    if (hasCommits) {
      console.error(
        i18n.t('errors.hasCommits', { folder: foldersWithGit.join(' and ') }),
      );
      process.exit(0);
    }
  }

  console.log();

  const steps: SpinnerStep[] = [
    {
      text: i18n.t('commands.prebuild'),
      command: async () => {
        await execAsync('pnpm', ['expo', 'prebuild', clean ? '--clean' : ''], 
          process.cwd(),
        );
      },
    },
    {
      text: i18n.t('commands.initGitRepositories'),
      command: () => {
        folders.forEach((folder) => {
          initGitRepo(folder);
        });
      },
    },
  ];

  for (const step of steps) {
    await runWithSpinner(step);
  }

  console.log();
  console.log(i18n.t('success.init'));
};
