import { mkdirSync } from 'node:fs';

export const createFolder = (folderName: string): void => {
  mkdirSync(folderName, { recursive: true });
};
