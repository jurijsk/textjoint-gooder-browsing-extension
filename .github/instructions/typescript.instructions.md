---
applyTo: "**/*.ts,**/*.tsx"
---

## TypeScript Guidelines
- Prefer using plain loops: `for`, `for .. in`, `for .. of`, `while`, and `do .. while`, instead of `forEach()`. Only use map(), reduce() if the code in much more concise using those function. 
- Avoid "arrow code" anti-pattern. Instead of wrapping the entire code of the function or loop into `if .. then` do reverse condition and `return` or `continue`
- No not use comments to explain simple statements. The code should be self explanatory.


## Code formatting
- Use single quotes
- Do not omit semicolons
- Not not add new line after opening brackets
