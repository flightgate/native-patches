# @flightgate/native-patches

## 0.1.0-beta.2

### Patch Changes

- 150ba11: Fix `--debug` mode hanging when subprocess requires user input.

  When using `--debug`, the ora spinner was conflicting with the subprocess stdout, causing interactive prompts (like expo prebuild's uncommitted changes warning) to hang. Spinner is now skipped in debug mode since output is already visible.

## 0.1.0-beta.1

### Minor Changes

- c4ea0a9: Add `--debug` flag to all commands to show full command output.

  By default all subprocess output (git, prebuild) is suppressed. Pass `--debug` to any command to pipe it to the terminal, useful for diagnosing patch failures or prebuild errors.

  ```bash
  native-patches apply --debug
  native-patches init --debug --clean
  ```

## 0.1.0-beta.0

### Minor Changes

- 4baf5f5: 🎉 Initial release of Native Patches - Manage native modifications in Expo projects without committing android/ios folders.

  **Features:**

  - ✨ **CLI Commands**: `init`, `generate`, `apply`, and `cancel` for managing native patches
  - 🎯 **Target Support**: Apply patches to `android`, `ios`, or `all` platforms
  - 🔄 **Auto-apply**: Expo plugin and postprebuild script support for automatic patch application
  - 🌍 **i18n**: Internationalization support with English locale
  - 🎨 **Rich UX**: Spinners, colored output, confirmation prompts, and helpful error messages
  - 📦 **TypeScript**: Fully typed with TypeScript for better DX
  - 🛠️ **Expo Plugin**: Experimental plugin for automatic patch application (use postprebuild for reliability)

  **Usage:**

  ```bash
  # Initialize tracking
  npx native-patches init

  # Make changes to android/ios folders
  # ...

  # Generate patches
  npx native-patches generate --name "my-changes"

  # Commit patches to git
  git add native-patches/ && git commit -m "chore: add native patches"

  # Auto-apply on future prebuilds (add to package.json)
  {
    "scripts": {
      "prebuild": "expo prebuild",
      "postprebuild": "native-patches apply"
    }
  }
  ```

  **Known Limitations:**

  - Patches may need regeneration after Expo SDK updates
  - Plugin auto-apply is experimental; `postprebuild` script is more reliable
  - Binary files in patches are not supported

  Feedback and contributions welcome! 🚀
