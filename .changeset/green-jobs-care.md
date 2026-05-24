---
"@flightgate/native-patches": minor
---

Add `xcode-add` command and automatic Xcode project linking for new iOS source files.

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
