# @flightgate/native-patches

## 0.1.0-beta.5

### Minor Changes

- d75f1e0: Add `xcode-add` command and automatic Xcode project linking for new iOS source files.

  **New command: `xcode-add`**

  Programmatically adds source files to the Xcode project using `@expo/config-plugins`, bypassing `project.pbxproj` patches entirely. UUID-independent and idempotent — safe to run multiple times.

  ```bash
  native-patches xcode-add -f OlDoutor/CallKitSync.swift -f OlDoutor/CallKitSync.m
  ```

  **Automatic linking on `apply`**

  The `generate` command now detects new source files (`.swift`, `.m`, `.mm`, `.h`) via `git ls-files` before creating the patch, and saves them to a `<name>.xcode-files` manifest alongside the `.patch` file.

  The `apply` command reads this manifest and runs `xcode-add` automatically — both when a patch is applied for the first time and when it is already applied (e.g. after `expo prebuild --clean` regenerates the project).

  **Revert `apply` to `git apply`**

  Reverts the patch application back to `git apply` with `git apply --reverse --check` for idempotency, replacing the previous `patch --fuzz` approach that could hang on interactive input.

## 0.1.0-beta.4

### Patch Changes

- 14fa4f7: Update patch application commands to use 'patch' instead of 'git apply' for improved compatibility

## 0.1.0-beta.3

### Patch Changes

- bc2a24f: Improve patch application logic to handle already applied patches

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
