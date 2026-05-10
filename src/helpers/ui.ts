import { createInterface } from 'node:readline';
import ora from 'ora';
import { i18n } from '../i18n';
import type { SpinnerStep } from '../types';

export const askConfirmation = (question: string): Promise<boolean> => {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question(`${question} (Y/N): `, (answer) => {
      readline.close();
      resolve(['y', 'yes'].includes(answer.toLowerCase()));
    });
  });
};

export const runWithSpinner = async (step: SpinnerStep): Promise<void> => {
  const spinner = ora(step.text).start();

  try {
    await step.command();

    spinner.succeed(step.text);
  } catch (e) {
    spinner.fail(i18n.t('errors.failedToRunStep', { step: step.text }));

    throw e;
  }
};
