import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

export const isGitRepo = (dir: string): boolean => {
  return existsSync(path.join(dir, '.git'));
};

export const initGitRepo = (dir: string): void => {
  const options = { cwd: dir, stdio: 'pipe' as const };

  execSync('git init', options);
  execSync('git add .', options);
  execSync('git config user.name "Native Patches"', options);
  execSync('git config user.email "native-patches@flightgate.dev"', options);
  execSync('git commit -m "feat: initial commit :tada:"', options);
};

export const getCommitCount = (dir: string): number => {
  try {
    const count = execSync('git rev-list --count HEAD', {
      cwd: dir,
      encoding: 'utf8',
      stdio: 'pipe',
    });

    return parseInt(count.trim(), 10);
  } catch {
    return 0;
  }
};

export const removeGitRepo = (dir: string): void => {
  execSync('rm -rf .git', { cwd: dir, stdio: 'inherit' });
};

export const hasChanges = (dir: string): boolean => {
  try {
    const status = execSync('git status --porcelain', {
      cwd: dir,
      stdio: 'pipe',
      encoding: 'utf8',
    });
    return status.trim().length > 0;
  } catch {
    return false;
  }
};
