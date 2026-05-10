import {
  type ConfigPlugin,
  type ExportedConfigWithProps,
  withDangerousMod,
} from '@expo/config-plugins';
import { execAsync } from '../helpers/process';
import { i18n } from '../i18n';
import type { Target } from '../types';

const applyPatches = async (
  modConfig: ExportedConfigWithProps,
  target: Target,
) => {
  const projectRoot = modConfig.modRequest.projectRoot;

  try {
    await execAsync(
      'npx',
      ['native-patches', 'apply', '--target', target],
      projectRoot,
    );
  } catch {
    console.error(i18n.t('errors.failedToApplyByTarget', { target }));
  }

  return modConfig;
};

const withNativePatches: ConfigPlugin = (config) => {
  // Android
  config = withDangerousMod(config, [
    'android',
    async (modConfig) => applyPatches(modConfig, 'android'),
  ]);

  // iOS
  config = withDangerousMod(config, [
    'ios',
    async (modConfig) => applyPatches(modConfig, 'ios'),
  ]);

  return config;
};

export default withNativePatches;
