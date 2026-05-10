import type { Target, TargetsInfo } from '../types';
import { isGitRepo } from './git';

export const getTargetsInfo = (target: Target): TargetsInfo => {
  const androidHasGit = isGitRepo('android');
  const iosHasGit = isGitRepo('ios');

  const shouldProcessAndroid = target === 'android' || target === 'all';
  const shouldProcessIos = target === 'ios' || target === 'all';

  const foldersWithoutGit: string[] = [];
  const foldersWithGit: string[] = [];
  const folders: string[] = [];

  if (shouldProcessAndroid && !androidHasGit) foldersWithoutGit.push('android');
  if (shouldProcessIos && !iosHasGit) foldersWithoutGit.push('ios');

  if (shouldProcessAndroid && androidHasGit) foldersWithGit.push('android');
  if (shouldProcessIos && iosHasGit) foldersWithGit.push('ios');

  if (shouldProcessAndroid) folders.push('android');
  if (shouldProcessIos) folders.push('ios');

  return {
    foldersWithoutGit,
    foldersWithGit,
    folders,
  };
};
