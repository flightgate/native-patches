import { existsSync, mkdirSync, readFileSync } from 'node:fs';

export const createFolder = (folderName: string): void => {
  mkdirSync(folderName, { recursive: true });
};

export const readXcodeFilesManifest = (patchPath: string): string[] => {
  const manifestPath = patchPath.replace(/\.patch$/, '.xcode-files');

  if (!existsSync(manifestPath)) return [];

  return readFileSync(manifestPath, 'utf8')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);
};
