import { createHmac } from "node:crypto";
import type { Optional, WebAppChatType, WebAppInitData } from "./types";

export function parseInitData(query: string): WebAppInitData {
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

export function validateInitData(webAppInitData: string, token: string) {
	const { hash, ...data } = Object.fromEntries(
		new URLSearchParams(webAppInitData),
	);

	const dataCheckString = Object.keys(data)
		.sort()
		.map((key) => `${key}=${data[key]}`)
		.join("\n");


	const secretKey = createHmac("sha256", "WebAppData").update(token).digest();

	const calculatedHash = createHmac("sha256", secretKey)
		.update(dataCheckString)
		.digest("hex");

	if (hash !== calculatedHash) return false;

	return true;
}

// TODO: prevent double URLSearchParams
export function validateAndParseInitData(query: string, token: string) {
	const result = validateInitData(query, token);

	if (!result) return false;

	return parseInitData(query);
}
