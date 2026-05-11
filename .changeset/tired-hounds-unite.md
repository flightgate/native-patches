---
"@flightgate/native-patches": patch
---

Fix `--debug` mode hanging when subprocess requires user input.

When using `--debug`, the ora spinner was conflicting with the subprocess stdout, causing interactive prompts (like expo prebuild's uncommitted changes warning) to hang. Spinner is now skipped in debug mode since output is already visible.
