import { spawn } from 'node:child_process';
import { config } from './config';

export const execAsync = (command: string, args: string[], cwd: string) => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: config.stdio });
    child.on('error', reject);
    child.on('close', (code) => {
      code === 0 ? resolve() : reject(new Error(`Exited with code ${code}`));
    });
  });
};
