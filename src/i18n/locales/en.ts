const nextSteps = [
  '',
  '  Next steps:',
  '',
  '  1. Commit the patches to your repository:',
  `     $ git add native-patches/`,
  `     $ git commit -m "chore: native patches"`,
  '',
  '  2. Add auto-apply to your app.json:',
  `     { "expo": { "plugins": ["@flightgate/native-patches"] } }`,
  '',
  '  Your changes are now preserved!',
].join('\n');

export const en = {
  errors: {
    resetOperation: `{error} Operation reset`,
    hasCommits: [
      `{error} The %{folder} folder(s) already have uncommitted changes`,
      '',
      '  Save your changes first:',
      '  native-patches generate --name <name>',
      '',
      '  Or force reset with:',
      '  native-patches init --clean',
    ].join('\n'),
    hasNotInitialized: [
      `{error} The %{folder} folder(s) not initialized yet`,
      '',
      '  Run this first:',
      '  native-patches init --target <android|ios|all>',
    ].join('\n'),
    noAndroidOrIosFolders: [
      `{error} No android/ or ios/ folders found`,
      '',
      '  Generate native folders first:',
      '  expo prebuild',
    ].join('\n'),
    notAppliedPatch: `  {error} %{patch}`,
    failedToApply: `{error} Failed to apply %{count} patches`,
    failedToApplyByTarget: `{error} Failed to apply %{count} patches`,
  },
  warnings: {
    hasChanges: [
      `{warning} The %{folder} folder(s) have unsaved changes`,
      '',
      '  Continue? Your changes will be lost.',
    ].join('\n'),
    noPatchesFound: `{warning} No patches found for %{folder}/`,
    noChanges: `{warning} No changes in %{folder}/, skipping...`,
  },
  success: {
    init: [
      `{success} Native patches tracking enabled`,
      '',
      '  Make your changes, then run:',
      '  native-patches generate --name <name>',
    ].join('\n'),
    reset: [
      `{success} Tracking removed`,
      '',
      '  {warning} Any uncommitted changes were lost.',
      '  Run "native-patches init" to start tracking again.',
    ].join('\n'),
    generate: {
      zero: [
        `{warning} No changes to save`,
        '',
        '  Nothing was generated. Tracking has been disabled.',
        '',
        '  To try again:',
        '  1. Run: native-patches init',
        '  2. Make changes in android/ or ios/',
        '  3. Run: native-patches generate --name <name>',
      ].join('\n'),
      one: [
        `{success} Patch created successfully`,
        nextSteps,
      ].join('\n'),
      other: [
        `{success} Patches created successfully`,
        nextSteps,
      ].join('\n'),
    },
    apply: {
      zero: `{success} No patches applied`,
      one: `{success} Patch applied`,
      other: `{success} Applied %{count} patches`,
    },
    appliedPatch: `  {success} %{patch}`,
  },
  commands: {
    init: '🚀 Initializing Native Patches...',
    prebuild: 'Generating native folders...',
    initGitRepositories: 'Setting up change tracking...',
    reset: '🧹 Cleaning up...',
    generate: '📦 Generating patches...',
    apply: '🔧 Applying patches...',
    applyByTarget: '🔧 Applying %{count} patch(es) to %{folder}/:\n',
  },
};
