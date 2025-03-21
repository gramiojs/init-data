import { parseInitData } from "./init-data.ts";
import type { WebAppInitData } from "./types.ts";

const TELEGRAM_PUBLIC_KEYS = {
	test: "40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec",
	production:
		"e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d",
} as const;

interface ThirdPartyValidationOptions {
	/**
	 * Maximum age of auth_date in seconds
	 * @default 86400 (24 hours)
	 */
	maxAge?: number;
	/**
	 * Whether to use test environment public key
	 * @default false
	 */
	isTest?: boolean;
}

/**
 * Validates Telegram Web App init data for third-party use
 * @param initData - Raw init data string from Telegram.WebApp.initData
 * @param botId - Your bot ID (numbers before : in bot token)
 * @param options - Validation options
 * @returns Parsed and validated data or false if validation fails
 */
export async function validateInitDataThirdParty(
	initData: string,
	botId: string,
	options: ThirdPartyValidationOptions = {},
): Promise<WebAppInitData | false> {
	const { maxAge = 86400, isTest = false } = options;
	const searchParams = new URLSearchParams(initData);

	const signature = searchParams.get("signature");
	const { signature: _, ...data } = Object.fromEntries(searchParams);

	if (!signature) return false;

	const dataCheckString = `${botId}:WebAppData\n${Object.keys(data)
		.sort()
		.map((key) => `${key}=${data[key]}`)
		.join("\n")}`;

	const publicKey = TELEGRAM_PUBLIC_KEYS[isTest ? "test" : "production"];

	try {
		const isValid = await verifyEd25519Signature(
			publicKey,
			dataCheckString,
			signature,
		);

		if (!isValid) return false;

		const authDate = Number(data.auth_date);
		if (Number.isNaN(authDate)) return false;

		const now = Math.floor(Date.now() / 1000);
		if (now - authDate > maxAge) return false;

		return parseInitData(initData);
	} catch {
		return false;
	}
}

// TODO: Maybe find an Node way which is faster?
const { subtle } = globalThis.crypto;

async function verifyEd25519Signature(
	publicKeyHex: string,
	message: string,
	signatureBase64Url: string,
): Promise<boolean> {
	try {
		const publicKeyBuffer = Buffer.from(publicKeyHex, "hex");
		const publicKey = await subtle.importKey(
			"raw",
			publicKeyBuffer,
			{ name: "Ed25519" },
			true,
			["verify"],
		);

		const signatureBuffer = Buffer.from(signatureBase64Url, "base64url");
		const messageBuffer = new TextEncoder().encode(message);

		return await subtle.verify(
			{ name: "Ed25519" },
			publicKey,
			signatureBuffer,
			messageBuffer,
		);
	} catch (error) {
		console.error("Ed25519 verification error:", error);
		return false;
	}
}
