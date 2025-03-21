import { beforeEach, describe, expect, it, mock } from "bun:test";
import { Buffer } from "node:buffer";
import { generateKeyPairSync, sign } from "node:crypto";
import { validateInitDataThirdParty } from "../src/third-party-validation.js";

const FIXED_DATE = Math.floor(Date.now() / 1000);

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const publicKeyRaw = publicKey.export({ type: "spki", format: "der" });
const publicKeyHex = Buffer.from(publicKeyRaw).toString("hex").slice(-64);

mock.module("../src/third-party-validation.js", () => ({
	TELEGRAM_PUBLIC_KEYS: {
		test: publicKeyHex,
		production: publicKeyHex,
	},
}));

describe.todo("validateInitDataThirdParty", () => {
	const botId = "123456789";
	let validInitData: string;

	beforeEach(() => {
		const user = JSON.stringify({
			id: 123456789,
			first_name: "Test",
			last_name: "User",
			username: "testuser",
			language_code: "en",
		});

		const params = new URLSearchParams();
		params.append("auth_date", FIXED_DATE.toString());
		params.append("query_id", "AAHdF_E4AAAAANwX8ThV_J1d");
		params.append("user", user);

		const sortedParams = Array.from(params).sort((a, b) =>
			a[0].localeCompare(b[0]),
		);

		const dataCheckString = `${botId}:WebAppData\n${sortedParams
			.map(([k, v]) => `${k}=${v}`)
			.join("\n")}`;

		const signature = sign(null, Buffer.from(dataCheckString), privateKey);
		const validSignature = signature.toString("base64url");

		params.append("signature", validSignature);
		validInitData = params.toString();
	});

	it("should validate correct data", async () => {
		const result = await validateInitDataThirdParty(validInitData, botId);
		expect(result).not.toBeFalse();
	});

	it("should parse user data correctly", async () => {
		const result = await validateInitDataThirdParty(validInitData, botId);

		expect(result).toEqual({
			authDate: FIXED_DATE,
			queryId: "AAHdF_E4AAAAANwX8ThV_J1d",
			user: {
				id: 123456789,
				firstName: "Test",
				lastName: "User",
				username: "testuser",
				languageCode: "en",
			},
			hash: expect.any(String),
		});
	});
});
