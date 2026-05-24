import { IOSConfig } from '@expo/config-plugins';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { i18n } from '../i18n';

const { XcodeUtils, Paths } = IOSConfig;

export const xcodeAddCommand = (files: string[]) => {
  if (files.length === 0) {
    console.error(i18n.t('errors.xcodeAdd.noFiles'));
    process.exit(1);
  }

  const projectRoot = process.cwd();

  let project: ReturnType<typeof XcodeUtils.getPbxproj>;
  let pbxprojPath: string;

  try {
    pbxprojPath = Paths.getPBXProjectPath(projectRoot);
    project = XcodeUtils.getPbxproj(projectRoot);
  } catch {
    console.error(i18n.t('errors.xcodeAdd.noProject'));
    process.exit(1);
  }

  console.log(i18n.t('commands.xcodeAdd'));
  console.log();

  let added = 0;
  let skipped = 0;

  for (const file of files) {
    const absolutePath = path.join(projectRoot, 'ios', file);

    if (!existsSync(absolutePath)) {
      console.error(i18n.t('errors.xcodeAdd.fileNotFound', { file }));
      process.exit(1);
    }

    if (project.hasFile(file)) {
      console.log(i18n.t('success.xcodeAdd.alreadyAdded', { file }));
      skipped++;
      continue;
    }

    const groupName = path.dirname(file);

    project = XcodeUtils.addBuildSourceFileToGroup({
      filepath: file,
      groupName,
      project,
    });

    console.log(i18n.t('success.xcodeAdd.added', { file }));
    added++;
  }

  writeFileSync(pbxprojPath!, project.writeSync());

  console.log();
  console.log(i18n.t('success.xcodeAdd.summary', { count: added, added, skipped }));
};
