
import { bench, do_not_optimize, run, summary } from "mitata";
import { parseInitData, validateAndParseInitData, validateInitData, getBotTokenSecretKey } from "../src/index.ts";


const queryString =
	"user=%7B%22id%22%3A617580375%2C%22first_name%22%3A%22kravets%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22noname2544%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-431068947458840694&chat_type=private&auth_date=1723409203&hash=5854de54c66e52cba3e438dd61658406c9f0216d8c783f9e9af80f514692273b";

const secretToken = process.env.BOT_TOKEN;
if (!secretToken) throw new Error("Please provide Token for bench");

const secretKey = getBotTokenSecretKey(secretToken);

summary(() => {
	bench("validateAndParseInitData", () => {
		do_not_optimize(validateAndParseInitData(queryString, secretToken));
	});
	bench("validateAndParseInitData with secretKey", () => {
		do_not_optimize(validateAndParseInitData(queryString, secretKey));
	});

	bench("validateInitData", () => {
		do_not_optimize(validateInitData(queryString, secretToken));
	});
	bench("validateInitData with secretKey", () => {
		do_not_optimize(validateInitData(queryString, secretKey));
	});
    bench("parseInitData", () => {
		do_not_optimize(parseInitData(queryString));
	});
});

await run();


// !NODE
// bunx tsx --env-file .env  .\benchmarks\result.ts
// clk: ~3.83 GHz
// cpu: AMD Ryzen 7 7700 8-Core Processor
// runtime: node 22.10.0 (x64-win32)

// benchmark                   avg (min … max) p75   p99    (min … top 1%)
// ------------------------------------------- -------------------------------
// validateAndParseInitData       9.91 µs/iter   9.20 µs  █
//                         (8.60 µs … 1.69 ms)  16.10 µs ▃█▄▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
// validateAndParseInitData w..   7.81 µs/iter   7.84 µs         █
//                         (7.64 µs … 8.08 µs)   7.96 µs █▁▁▁▁▁▁▅██▅▁▅█▁▁▁▁▅▁▅
// validateInitData               7.02 µs/iter   7.11 µs █  █       █ █  █    
//                         (6.81 µs … 7.31 µs)   7.19 µs ██▁█▁▁█▁█▁████▁▁█▁███
// validateInitData with secr..   5.09 µs/iter   5.14 µs             ▄   █▄ ▄ 
//                         (4.80 µs … 5.22 µs)   5.19 µs ▅▁▁▁▁▅▅▁▁▁▅▁██████▅██
// parseInitData                  2.51 µs/iter   2.52 µs  ▄█
//                         (2.45 µs … 2.69 µs)   2.67 µs ▅███▄▇▆▄▁▂▆▂▂▄▂▁▂▂▂▁▂

// summary
//   parseInitData
//    2.03x faster than validateInitData with secretKey
//    2.8x faster than validateInitData
//    3.11x faster than validateAndParseInitData with secretKey
//    3.95x faster than validateAndParseInitData

// !BUN
// bun .\benchmarks\result.ts     
// clk: ~3.44 GHz
// cpu: AMD Ryzen 7 7700 8-Core Processor
// runtime: bun 1.2.5 (x64-win32)

// benchmark                   avg (min … max) p75   p99    (min … top 1%)
// ------------------------------------------- -------------------------------
// validateAndParseInitData       9.89 µs/iter  10.11 µs        █        █   █
//                        (9.39 µs … 10.41 µs)  10.16 µs █▁█▁█▁▁█▁▁▁▁▁▁▁▁██▁██
// validateAndParseInitData w..   9.78 µs/iter  10.02 µs   █  ▃      ▃        
//                        (9.33 µs … 10.72 µs)  10.49 µs ▆▆█▁▁█▆▁▁▁▆▁█▁▁▁▁▁▁▁▆
// validateInitData               6.32 µs/iter   6.45 µs   █▂    ▂
//                         (5.99 µs … 7.17 µs)   7.16 µs ▇▄██▄▄▁▄█▁▄▄▁▁▁▁▁▁▁▁▄
// validateInitData with secr..   5.83 µs/iter   5.84 µs  ▃    █
//                         (5.56 µs … 6.99 µs)   6.45 µs ▄██▆▄▄█▆▁▄▁▁▁▁▁▁▁▁▁▁▄
// parseInitData                  3.56 µs/iter   3.69 µs  ▄▂▂ █    ▂
//                         (3.34 µs … 4.22 µs)   4.06 µs ▅███▅█▃▃▃▅█▅▅▁▃▁▁▁▁▁▃

// summary
//   parseInitData
//    1.64x faster than validateInitData with secretKey
//    1.77x faster than validateInitData
//    2.74x faster than validateAndParseInitData with secretKey
//    2.77x faster than validateAndParseInitData