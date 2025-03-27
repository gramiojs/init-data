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

// For optimal performance, pre-compute the secret key
const secretKey = getBotTokenSecretKey(BOT_TOKEN);

const result = validateAndParseInitData(initData, secretKey);

if (!result) {
    console.error("init data is invalid");
} else console.log(result);

const isValid = validateInitData(initData, secretKey);
const parsedButUnsafe = parseInitData(initData);
```

Result is the same as in the [official docs - WebAppInitData](https://core.telegram.org/bots/webapps#webappinitdata).

## Signing Init Data

Generate valid initData strings for testing and etc.

### Basic Usage

```typescript
import { signInitData } from "@gramio/init-data";

// Sign from existing parsed object
const validInitData = signInitData(
    {
        user: {
            id: 12345,
            first_name: "Signed",
            username: "signed_user",
        },
    },
    BOT_TOKEN
);

// Sign from raw query string
const validInitData = signInitData(
    "auth_date=123456789&user=%7B%22id%22%3A12345%7D",
    BOT_TOKEN
);
```

### TODO:

-   Better throw error on invalid data
-   Throw error on old auth_date
-   Optimize
