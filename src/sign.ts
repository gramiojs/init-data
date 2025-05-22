import type { MakeOptional, WebAppInitData } from "./types.ts";
import {
	getBotTokenSecretKey,
	serializeInitData,
	sha256Hash,
} from "./utils.ts";

function calculateHash(
	params: URLSearchParams,
	secretKey: string | Buffer,
): string {
	const dataCheckString = Array.from(params)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => `${key}=${value}`)
		.join("\n");

	return sha256Hash(secretKey, dataCheckString, "hex");
}

export function signInitData(
	initData: string,
	secretKeyOrToken: string | Buffer,
): string;
export function signInitData(
	initData: MakeOptional<WebAppInitData, "hash" | "auth_date">,
	secretKeyOrToken: string | Buffer,
): string;
export function signInitData(
	initData: string | MakeOptional<WebAppInitData, "hash" | "auth_date">,
	secretKeyOrToken: string | Buffer,
) {
	const secretKey =
		typeof secretKeyOrToken === "string"
			? getBotTokenSecretKey(secretKeyOrToken)
			: secretKeyOrToken;

	if (typeof initData !== "string") {
		const searchParams = serializeInitData(initData);
		const hash = calculateHash(searchParams, secretKey);
		return `${searchParams.toString()}&hash=${hash}`;
	}

	const searchParams = new URLSearchParams(initData);
	searchParams.delete("hash");
	const hash = calculateHash(searchParams, secretKey);
	searchParams.set("hash", hash);
	return searchParams.toString();
}
