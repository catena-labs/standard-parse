---
"standard-parse": patch
---

Stop mislabeling every `ValidationError` as "Invalid type": the message now uses
the first issue's message verbatim (with the issue path prepended when present)
and falls back to "Validation failed" for empty issues, instead of
unconditionally prefixing "Invalid type:" and stripping one library's "Invalid
key:" marker
