---
"@flightgate/native-patches": minor
---

Add `--debug` flag to all commands to show full command output.

By default all subprocess output (git, prebuild) is suppressed. Pass `--debug` to any command to pipe it to the terminal, useful for diagnosing patch failures or prebuild errors.

```bash
native-patches apply --debug
native-patches init --debug --clean
```
