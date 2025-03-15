import { createHmac, type BinaryToTextEncoding } from "node:crypto";

export function parseJSON<T>(value: string | null): T | undefined {
	return value ? JSON.parse(value) : undefined;
}

const IS_BUN = typeof Bun !== "undefined";

export const sha256Hash = IS_BUN
		? (hmacKey: string, input: string, encoding?: BinaryToTextEncoding) =>
			// TODO: find a better way. for now, cast - solve overloading
			new Bun.CryptoHasher("sha256", hmacKey).update(input).digest(encoding as "hex")
	: (hmacKey: string, input: string, encoding?: BinaryToTextEncoding) =>
			createHmac("sha256", hmacKey).update(input).digest(encoding as BinaryToTextEncoding);

export function getBotTokenSecretKey(botToken: string) {
        return sha256Hash("WebAppData", botToken);
}
    