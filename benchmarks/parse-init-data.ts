import type { WebAppInitData, WebAppChatType, Optional } from "../src/types.ts";

export function parseInitDataV1(query: string): WebAppInitData {
	const searchParams = new URLSearchParams(query);

	const userData = searchParams.get("user");
	const userParsedData = userData ? JSON.parse(userData) : undefined;

	const receiverData = searchParams.get("receiver");
	const receiverParsedData = receiverData
		? JSON.parse(receiverData)
		: undefined;

	const chatData = searchParams.get("chat");
	const chatParsedData = chatData ? JSON.parse(chatData) : undefined;

	const optionalData = {
		queryId: searchParams.get("query_id") ?? undefined,

		user: userParsedData
			? {
					id: userParsedData.id,
					firstName: userParsedData.first_name,
					lastName: userParsedData.last_name,
					username: userParsedData.username,
					isPremium: userParsedData.is_premium,
					addedToAttachmentMenu: userParsedData.added_to_attachment_menu,
					allowsWriteToPm: userParsedData.allows_write_to_pm,
					photoUrl: userParsedData.photoUrl,
					languageCode: userParsedData.language_code,
				}
			: undefined,
		receiver: receiverParsedData
			? {
					id: receiverParsedData.id,
					firstName: receiverParsedData.first_name,
					lastName: receiverParsedData.last_name,
					username: receiverParsedData.username,
					isPremium: receiverParsedData.is_premium,
					addedToAttachmentMenu: receiverParsedData.added_to_attachment_menu,
					allowsWriteToPm: receiverParsedData.allows_write_to_pm,
					photoUrl: receiverParsedData.photoUrl,
					isBot: receiverParsedData.is_bot,
				}
			: undefined,

		chat: chatParsedData
			? {
					id: chatParsedData.id,
					type: chatParsedData.type,
					title: chatParsedData.title,
					username: chatParsedData.username,
					photoUrl: chatParsedData.photo_url,
				}
			: undefined,

		chatType: (searchParams.get("chat_type") as WebAppChatType) ?? undefined,
		chatInstance: searchParams.get("chat_instance") ?? undefined,
		startParam: searchParams.get("start_param") ?? undefined,
		canSendAfter: searchParams.get("can_send_after")
			? Number(searchParams.get("can_send_after"))
			: undefined,
		authDate: searchParams.get("auth_date")
			? Number(searchParams.get("auth_date"))
			: undefined,
		hash: searchParams.get("hash") ?? undefined,
	} satisfies Optional<WebAppInitData>;

	if (!optionalData.authDate || !optionalData.hash)
		throw new Error("Invalid data at parseInitData");

	// @ts-expect-error
	return optionalData;
}


import { bench, run, summary } from "mitata";
import { parseInitData, validateAndParseInitData, validateInitData } from "../src/index.ts";


const queryString =
    "user=%7B%22id%22%3A617580375%2C%22first_name%22%3A%22kravets%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22noname2544%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-431068947458840694&chat_type=private&auth_date=1723409203&hash=5854de54c66e52cba3e438dd61658406c9f0216d8c783f9e9af80f514692273b";

const secretToken = process.env.BOT_TOKEN;
if (!secretToken) throw new Error("Please provide Token for bench");

summary(() => {


    bench("parseInitDataV1", () => {
        parseInitDataV1(queryString);
    });
    bench("parseInitData", () => {
        parseInitData(queryString);
    });
});

await run();


// !NODE
// node benchmarks/rusha-vs-native.mjs
// clk: ~3.99 GHz
// cpu: AMD Ryzen 7 7700 8-Core Processor
// runtime: node 22.11.0 (x64-linux)

// benchmark                   avg (min … max) p75   p99    (min … top 1%)
// ------------------------------------------- -------------------------------
// _hash with rusha              12.10 µs/iter   7.25 µs █
//                         (4.66 µs … 1.27 ms) 116.62 µs █▄▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
// _hash with native            547.04 ns/iter 435.45 ns █
//                       (370.08 ns … 3.61 µs)   3.58 µs █▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

// summary
//   _hash with native
//    22.12x faster than _hash with rusha

// !BUN
// bun benchmarks/rusha-vs-native.mjs 
// clk: ~5.04 GHz
// cpu: AMD Ryzen 7 7700 8-Core Processor
// runtime: bun 1.1.37 (x64-linux)

// benchmark                   avg (min … max) p75   p99    (min … top 1%)
// ------------------------------------------- -------------------------------
// _hash with rusha              10.00 µs/iter   4.96 µs  █
//                         (2.60 µs … 2.78 ms)  45.85 µs ▂█▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
// _hash with native            471.82 ns/iter 420.00 ns █
//                     (370.00 ns … 949.79 µs)   1.99 µs █▆▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

// summary
//   _hash with native
//    21.19x faster than _hash with rusha
