---
'@flightgate/native-patches': minor
---

🎉 Initial release of Native Patches - Manage native modifications in Expo projects without committing android/ios folders.

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
