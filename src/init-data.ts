import type {
	Optional,
	WebAppChat,
	WebAppChatType,
	WebAppInitData,
	WebAppUser,
} from "./types.ts";
import { getBotTokenSecretKey, parseJSON, sha256Hash } from "./utils.ts";

export function parseInitData(query: string): WebAppInitData {
	const searchParams = new URLSearchParams(query);

	// TODO: replace any. maybe remove cast to camelCase
	const userParsedData = parseJSON<WebAppUser<false>>(searchParams.get("user"));
	const receiverParsedData = parseJSON<WebAppUser<true>>(
		searchParams.get("receiver"),
	);
	const chatParsedData = parseJSON<WebAppChat>(searchParams.get("chat"));

	const optionalData = {
		query_id: searchParams.get("query_id") ?? undefined,

		user: userParsedData ?? undefined,
		receiver: receiverParsedData ?? undefined,

		chat: chatParsedData ?? undefined,

		chat_type: (searchParams.get("chat_type") as WebAppChatType) ?? undefined,
		chat_instance: searchParams.get("chat_instance") ?? undefined,
		start_param: searchParams.get("start_param") ?? undefined,
		can_send_after: searchParams.get("can_send_after")
			? Number(searchParams.get("can_send_after"))
			: undefined,
		auth_date: Number(searchParams.get("auth_date")),
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		hash: searchParams.get("hash")!,
	} satisfies Optional<WebAppInitData>;

	if (!optionalData.auth_date || !optionalData.hash)
		throw new Error("Invalid data at parseInitData");

	return optionalData;
}

export function validateInitData(
	webAppInitData: string,
	token: string | Buffer,
) {
	const { hash, ...data } = Object.fromEntries(
		new URLSearchParams(webAppInitData),
	);

	const dataCheckString = Object.keys(data)
		.sort()
		.map((key) => `${key}=${data[key]}`)
		.join("\n");

	// TODO: add possibility to precompile this
	const secretKey =
		typeof token === "string" ? getBotTokenSecretKey(token) : token;

	const calculatedHash = sha256Hash(secretKey, dataCheckString, "hex");

	if (hash !== calculatedHash) return false;

	return true;
}

// TODO: prevent double URLSearchParams
export function validateAndParseInitData(query: string, token: string) {
	const result = validateInitData(query, token);

	if (!result) return false;

	return parseInitData(query);
}
