import { createHmac, type BinaryToTextEncoding } from "node:crypto";
import type { Optional, WebAppChatType, WebAppInitData } from "./types.ts";
import type { DigestEncoding } from "bun";

export * from "./types.ts";

function parseJSON<T>(value: string | null): T | undefined {
	return value ? JSON.parse(value) : undefined;
}

const IS_BUN = typeof Bun !== "undefined";

export const sha256Hash = IS_BUN
		? (hmacKey: string, input: string, encoding?: BinaryToTextEncoding) =>
			// TODO: find a better way. for now, cast - solve overloading
			new Bun.CryptoHasher("sha256", hmacKey).update(input).digest(encoding as DigestEncoding)
	: (hmacKey: string, input: string, encoding?: BinaryToTextEncoding) =>
			createHmac("sha256", hmacKey).update(input).digest(encoding as BinaryToTextEncoding);

export function parseInitData(query: string): WebAppInitData {
	const searchParams = new URLSearchParams(query);

	const userParsedData = parseJSON(searchParams.get("user"));
	const receiverParsedData = parseJSON(searchParams.get("receiver"));
	const chatParsedData = parseJSON(searchParams.get("chat"));

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
	const secretKey = sha256Hash("WebAppData", token);

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
