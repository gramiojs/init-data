import { type BinaryToTextEncoding, createHmac } from "node:crypto";
import type { MakeOptional, WebAppInitData } from "./types.ts";

export function parseJSON<T>(value: string | null): T | undefined {
	return value ? JSON.parse(value) : undefined;
}

const IS_BUN = typeof Bun !== "undefined";

export const sha256Hash = IS_BUN
	? (
			hmacKey: string | Buffer,
			input: string,
			encoding?: BinaryToTextEncoding,
		) =>
			// TODO: find a better way. for now, cast - solve overloading
			new Bun.CryptoHasher("sha256", hmacKey)
				.update(input)
				.digest(encoding as "hex")
	: (
			hmacKey: string | Buffer,
			input: string,
			encoding?: BinaryToTextEncoding,
		) =>
			createHmac("sha256", hmacKey)
				.update(input)
				.digest(encoding as BinaryToTextEncoding);

export function getBotTokenSecretKey(
	botToken: string,
): Buffer<ArrayBufferLike> {
	return sha256Hash(
		"WebAppData",
		botToken,
		// It is really buffer
	) as unknown as Buffer<ArrayBufferLike>;
}

export function serializeInitData(
	data: MakeOptional<WebAppInitData, "hash" | "auth_date">,
): URLSearchParams {
	const params = new URLSearchParams();

	if (data.query_id) params.set("query_id", data.query_id);
	params.set("auth_date", (data.auth_date ?? Date.now()).toString());

	if (data.user) params.set("user", JSON.stringify(data.user));
	if (data.receiver) params.set("receiver", JSON.stringify(data.receiver));
	if (data.chat) params.set("chat", JSON.stringify(data.chat));
	if (data.chat_type) params.set("chat_type", data.chat_type);
	if (data.chat_instance) params.set("chat_instance", data.chat_instance);
	if (data.start_param) params.set("start_param", data.start_param);
	if (data.can_send_after)
		params.set("can_send_after", data.can_send_after.toString());
	if (data.hash) params.set("hash", data.hash);

	return params;
}
