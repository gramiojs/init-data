import type { Optional, WebAppChatType, WebAppInitData } from "./types.ts";
import { getBotTokenSecretKey, parseJSON, sha256Hash } from "./utils.ts";

export function parseInitData(query: string): WebAppInitData {
	const searchParams = new URLSearchParams(query);

	// TODO: replace any. maybe remove cast to camelCase
	const userParsedData = parseJSON<any>(searchParams.get("user"));
	const receiverParsedData = parseJSON<any>(searchParams.get("receiver"));
	const chatParsedData = parseJSON<any>(searchParams.get("chat"));

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
					photoUrl: userParsedData.photo_url,
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
					photoUrl: receiverParsedData.photo_url,
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

export function validateInitData(webAppInitData: string, token: string) {
	const { hash, ...data } = Object.fromEntries(
		new URLSearchParams(webAppInitData),
	);

	const dataCheckString = Object.keys(data)
		.sort()
		.map((key) => `${key}=${data[key]}`)
		.join("\n");

	// TODO: add possibility to precompile this
	const secretKey = token.includes(":") ? getBotTokenSecretKey(token) : token;

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
