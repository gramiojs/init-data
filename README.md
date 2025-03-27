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
    getBotTokenSecretKey,
} from "@gramio/init-data";

const initData = "?user=...";
const BOT_TOKEN = "12312312:ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const secretKey = getBotTokenSecretKey(BOT_TOKEN);

const result = validateAndParseInitData(initData, secretKey);
// you can just pass BOT_TOKEN but it will be slower because it will hash this token every time

if (!result) {
    console.error("init data is invalid");
} else console.log(result);

const isValid = validateInitData(initData, secretKey);
const parsedButUnsafe = parseInitData(initData);
```

Result is the same as in the [official docs - WebAppInitData](https://core.telegram.org/bots/webapps#webappinitdata).

### TODO:

-   Better throw error on invalid data
-   Throw error on old auth_date
-   Optimize
