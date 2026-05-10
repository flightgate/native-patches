export type Target = 'android' | 'ios' | 'all';

export interface TargetsInfo {
  foldersWithoutGit: string[];
  foldersWithGit: string[];
  folders: string[];
}

export interface SpinnerStep {
  text: string;
  command: () => void | Promise<void>;
}
