# Native Patches

[![npm version](https://badge.fury.io/js/%40flightgate%2Fnative-patches.svg)](https://www.npmjs.com/package/@flightgate/native-patches)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Beta — early release. Feedback welcome.

Manage native modifications in Expo projects without committing `android/` and `ios/` folders to your repository.

## The Problem

When working with Expo, you sometimes need to modify native code (add Maven repositories, change Gradle settings, etc.). But these changes are lost every time you run `expo prebuild --clean`.

### Your Options

**Option 1: Commit `android/` and `ios/` folders**
- ✅ Simple and straightforward
- ❌ Large repo size (thousands of generated files)
- ❌ Merge conflicts on every Expo update
- ❌ Mixes your changes with generated code
- ❌ Hard to review what YOU actually changed

**Option 2: Use Expo Config Plugins**
- ✅ Keeps repo clean
- ❌ Hard to read (regex-heavy code)
- ❌ Fragile (breaks on template changes)
- ❌ Steep learning curve
- ❌ Debugging is difficult

**Option 3: Native Patches** ⭐
- ✅ Keeps repo clean (only `.patch` files)
- ✅ Easy to read (standard git diffs)
- ✅ Easy to maintain (just edit native files)
- ✅ Transparent (see exactly what changed)
- ✅ No learning curve (if you know git diffs)

**Native Patches** works by:
- 📦 Saving your native modifications as reusable patches
- 🔄 Auto-applying patches after every prebuild
- 🎯 Keeping your repository clean (no native folders committed)
- 🔍 Making changes transparent and reviewable (just `.patch` files)

## Installation

```bash
npm install @flightgate/native-patches
# or
yarn add @flightgate/native-patches
# or
pnpm add @flightgate/native-patches
```

## Quick start

### 1. Make your first patch

```bash
# Generate native folders
npx expo prebuild

# Initialize patch tracking
npx native-patches init

# Make your changes (e.g., edit android/build.gradle)
# Add your Maven repository, signing config, etc.

# Save changes as a patch
npx native-patches generate --name "add-maven-repo"
```

This creates a patch file in `native-patches/android/` or `native-patches/ios/`.

### 2. Commit the patches

```bash
git add native-patches/
git commit -m "chore: add native patches"
```

### 3. Auto-apply on prebuild

#### Method 1: `postprebuild` script (Recommended ⭐)

Add **both** scripts to your `package.json`:

```json
{
  "scripts": {
    "prebuild": "expo prebuild",
    "postprebuild": "native-patches apply"
  }
}
```

Now use `npm run prebuild` instead of calling `expo prebuild` directly:

```bash
# ✅ Use this (patches auto-apply)
npm run prebuild

# ❌ Don't use this (postprebuild won't run)
npx expo prebuild
```

The `postprebuild` script **only runs** when you use `npm run prebuild`. It won't run with `npx expo prebuild` or `pnpm expo prebuild`.

> 💡 **Tip:** Update your habits and team docs to use `npm run prebuild` everywhere.

#### Method 2: Expo plugin (Experimental)

Add to your `app.json`:

```json
{
  "expo": {
    "plugins": ["@flightgate/native-patches"]
  }
}
```

This works with `expo prebuild` called directly, but may fail if other plugins modify files after it runs.

> ⚠️ **Note:** If the plugin fails, you can always run `native-patches apply` manually after prebuild.

---

## Commands

### `init`

Initialize patch tracking in your native folders.

```bash
native-patches init [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `-t, --target <type>` | Target platform: `android`, `ios`, or `all` (default: `all`) |
| `--clean` | Run `expo prebuild` with `--clean` flag |

**Examples:**

```bash
# Initialize for both platforms
native-patches init

# Initialize only Android with clean rebuild
native-patches init --target android --clean

# Short form
native-patches i -t ios
```

### `generate`

Create patches from your native modifications.

```bash
native-patches generate [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Patch name (required) |
| `-t, --target <type>` | Target platform: `android`, `ios`, or `all` (default: `all`) |

**Examples:**

```bash
# Generate patch for Android changes
native-patches generate --name "add-sendbird-maven"

# Generate for both platforms
native-patches generate -n "custom-config" -t all

# Short form
native-patches c -n "my-patch"
```

### `apply`

Apply all patches to native folders.

```bash
native-patches apply [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `-t, --target <type>` | Target platform: `android`, `ios`, or `all` (default: `all`) |

**Examples:**

```bash
# Apply all patches
native-patches apply

# Apply only iOS patches
native-patches apply --target ios

# Short form
native-patches a -t android
```

### `cancel`

Remove patch tracking (cleanup temporary git repositories).

```bash
native-patches cancel [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `-t, --target <type>` | Target platform: `android`, `ios`, or `all` (default: `all`) |

**Examples:**

```bash
# Cancel tracking for all platforms
native-patches cancel

# Short form
native-patches reset
```

---

## Real-world examples

### Example 1: Add Maven repository

```bash
# 1. Initialize
npx expo prebuild
npx native-patches init --target android

# 2. Edit android/app/build.gradle
# Add release signing configuration:
#
# android {
#     signingConfigs {
#         release {
#             storeFile file("release.keystore")
#             storePassword "your-password"
#             keyAlias "your-alias"
#             keyPassword "your-password"
#         }
#     }
#     buildTypes {
#         release {
#             signingConfig signingConfigs.release
#         }
#     }
# }

# 3. Save as patch
npx native-patches generate --name "add-release-signing" --target android

# 4. Commit
git add native-patches/
git commit -m "chore: add release signing configuration"
```

---

## Workflow

```text
┌─────────────────────────────────────────────────────────────┐
│  Your team's workflow                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Developer A:                                               │
│  1. expo prebuild                                           │
│  2. native-patches init                                     │
│  3. Edit android/* or ios/*                                 │
│  4. native-patches generate --name "add-maven"              │
│  5. git commit native-patches/                              │
│  6. git push                                                │
│                                                             │
│  Developer B (after pull):                                  │
│  1. expo prebuild                                           │
│  2. Patches auto-apply via postprebuild                     │
│  3. Native changes are there                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## File structure

After using Native Patches, your project may look like:

```text
your-expo-project/
├── native-patches/           # Committed to git
│   ├── android/
│   │   └── 2024_05_10_120000-add-maven.patch
│   └── ios/
│       └── 2024_05_10_120100-custom-config.patch
├── android/                  # NOT committed (in .gitignore)
├── ios/                      # NOT committed (in .gitignore)
├── app.json
└── package.json
```

---

## Troubleshooting

### Patches fail to apply

**Symptom:** `error: patch does not apply`

**Possible causes:**

- Expo version changed (different prebuild output)
- Other plugins modified files after the patch was created
- Patch was created on a different Expo SDK version

**Fix:**

```bash
# Regenerate patches with current Expo version
rm -rf native-patches/
npx expo prebuild --clean
npx native-patches init
# Make your changes again
npx native-patches generate --name "regenerated-patch"
```

### Plugin doesn't apply patches automatically

Use the `postprebuild` script instead:

```json
{
  "scripts": {
    "postprebuild": "native-patches apply"
  }
}
```

### Mistake in a patch

Regenerate the patch:

```bash
# Remove old patches
rm -rf native-patches/

# Start fresh
npx expo prebuild --clean
npx native-patches init
# Make correct changes
npx native-patches generate --name "corrected-patch"
```

### Patches apply but changes don't work

Check:

- Did you commit the patches? `git status`
- Are patches in the right folder? `ls native-patches/android/`
- Did you pull the latest patches? `git pull`
- Try manual apply: `npx native-patches apply`

---

## How it works

Under the hood, Native Patches:

1. **Init** — Creates a temporary git repository in `android/` or `ios/` and commits the initial state.
2. **Generate** — Uses `git diff` to create patch files from your modifications.
3. **Apply** — Uses `git apply` to apply patches to freshly generated native folders.
4. **Cleanup** — Removes temporary git repositories after generating or applying patches.

Patches are standard unified diff format (`.patch` files) that you can inspect, edit, or apply manually if needed.

---

## Best practices

**Do:**

- Commit patches to your repository
- Use descriptive patch names (`add-maven-repo`, not `fix`)
- Regenerate patches after major Expo SDK updates
- Use the `postprebuild` script for reliability
- Keep patches small and focused

**Don't:**

- Commit `android/` or `ios/` folders (keep them in `.gitignore`)
- Edit patch files manually (regenerate instead)
- Mix unrelated changes in one patch
- Forget to run `generate` after making changes

---

## Limitations

- Expo SDK updates may require patch regeneration
- Plugin execution order can cause auto-apply to fail (use `postprebuild`)
- Binary files in patches are not supported
- Large diffs may be slow to apply

---

## FAQ

**Why not just commit `android/` and `ios/`?**

You can, but it makes the repo larger, invites merge conflicts, and includes generated code. Native Patches keeps the repo lean while preserving modifications.

**Can I edit patch files manually?**

Technically yes (they are standard `.patch` files), but regenerating is safer.

**Does this work with EAS Build?**

Yes. Use the `postprebuild` script method; EAS will run it automatically.

**What if my patches conflict?**

Regenerate them with the current Expo version. Patches are tied to the specific prebuild output.

**Can I have multiple patches for the same platform?**

Yes. All `.patch` files in `native-patches/android/` or `native-patches/ios/` are applied in alphabetical order.

---

## Contributing

We'd love your help making Native Patches better! 🙌

- 🐛 [Report bugs](https://github.com/flightgate/native-patches/issues)
- 💡 [Request features](https://github.com/flightgate/native-patches/issues)
- 🔧 [Submit PRs](https://github.com/flightgate/native-patches/pulls)
- 💬 [Join discussions](https://github.com/flightgate/native-patches/discussions)

**Found this useful?** Give it a ⭐️ on GitHub!

---

## License

MIT © FlightGate

Made with care for the Expo community.
