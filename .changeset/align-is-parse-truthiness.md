---
"standard-parse": patch
---

Align `is()` with `parse()` by treating a truthy `issues` value as failure
(fail closed), instead of requiring `issues === undefined` for success
