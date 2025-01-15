# @gramio/init-data

[![npm](https://img.shields.io/npm/v/@gramio/init-data?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/init-data)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/init-data?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/init-data)
[![JSR](https://jsr.io/badges/@gramio/init-data)](https://jsr.io/@gramio/init-data)
[![JSR Score](https://jsr.io/badges/@gramio/init-data/score)](https://jsr.io/@gramio/init-data)

### Usage

```ts
import {
    verifyAndParseInitData,
    verifyInitData,
    parseInitData,
} from "@gramio/init-data";

const initData = "?user=...";
const BOT_TOKEN = "12312312:ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const result = verifyAndParseInitData(initData, BOT_TOKEN);

if (!result) {
    console.error("init data is invalid");
} else console.log(result);
// {
//   vk_user_id: 494075,
//   vk_app_id: 6736218,
//   vk_is_app_user: true,
//   vk_are_notifications_enabled: true,
//   vk_language: "ru",
//   vk_access_token_settings: "",
//   vk_platform: "android",
//   sign: "htQFduJpLxz7ribXRZpDFUH-XEUhC9rBPTJkjUFEkRA",
//   vk_is_favorite: false,
// }

const isValid = verifyInitData(initData, BOT_TOKEN);
const parsedButUnsafe = parseInitData(initData);
```

### TODO:

-   Better types
-   Better throw error on invalid data
-   Optimize
