---
"standard-parse": patch
---

Clarify the TypeError message thrown when an async schema is passed to
`safeParse`, `parse`, or `is`: it now states that async schemas are unsupported
instead of incorrectly blaming the input for being a Promise
