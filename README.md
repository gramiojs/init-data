# @gramio/init-data

[![npm](https://img.shields.io/npm/v/@gramio/init-data?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/init-data)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/init-data?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/init-data)
[![JSR](https://jsr.io/badges/@gramio/init-data)](https://jsr.io/@gramio/init-data)
[![JSR Score](https://jsr.io/badges/@gramio/init-data/score)](https://jsr.io/@gramio/init-data)

### Usage

```ts
import {
    validateAndParseInitData,
    validateInitData,
    parseInitData,
} from "@gramio/init-data";

const initData = "?user=...";
const BOT_TOKEN = "12312312:ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const result = validateAndParseInitData(initData, BOT_TOKEN);

if (!result) {
    console.error("init data is invalid");
} else console.log(result);

const isValid = validateInitData(initData, BOT_TOKEN);
const parsedButUnsafe = parseInitData(initData);
```

### TODO:

-   Better types
-   Better throw error on invalid data
-   Optimize
