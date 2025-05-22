import { describe, expect, it, test } from "bun:test";
import {
	getBotTokenSecretKey,
	parseInitData,
	validateAndParseInitData,
	validateInitData,
} from "../src/index.ts";

const nowDate = Date.now();

const queryString =
	"user=%7B%22id%22%3A617580375%2C%22first_name%22%3A%22kravets%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22noname2544%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-431068947458840694&chat_type=private&auth_date=1723409203&hash=5854de54c66e52cba3e438dd61658406c9f0216d8c783f9e9af80f514692273b";

const secretToken = process.env.BOT_TOKEN;
if (!secretToken) throw new Error("Please provide Token for tests");

const initDataString = new URLSearchParams({
	query_id: "1",
	user: JSON.stringify({
		id: 1,
		first_name: "Durov",
		language_code: "ru",
	}),
	auth_date: String(nowDate),
	hash: "some",
});

describe("", () => {
	test("parseInitData()", () => {
		const data = parseInitData(initDataString.toString());
		console.log(data);

		expect(data).toEqual({
			query_id: "1",
			user: {
				id: 1,
				first_name: "Durov",
				language_code: "ru",
			},
			auth_date: nowDate,
			hash: "some",
		});
	});
	test("validateInitData()", () => {
		const result = validateInitData(queryString, secretToken);

		expect(result).toBe(true);
	});
	test("validateInitData() should return false", () => {
		const params = new URLSearchParams(queryString);

		params.set("auth_date", "1");

		const result = validateInitData(params.toString(), secretToken);

		expect(result).toBe(false);
	});
	test("validateAndParseInitData()", () => {
		const result = validateAndParseInitData(queryString, secretToken);

		expect(result).not.toBe(false);
		expect(result).toEqual({
			auth_date: 1723409203,
			chat_instance: "-431068947458840694",
			chat_type: "private",
			hash: "5854de54c66e52cba3e438dd61658406c9f0216d8c783f9e9af80f514692273b",
			user: {
				id: 617580375,
				first_name: "kravets",
				allows_write_to_pm: true,
				is_premium: true,
				language_code: "ru",
				last_name: "",
				username: "noname2544",
			},
		});
	});

	test("getBotTokenSecretKey()", () => {
		const secretKey = getBotTokenSecretKey(secretToken);

		console.log(typeof secretKey);
		expect(secretKey).toBeInstanceOf(Buffer);
	});

	test("validateInitData() with secretKey", () => {
		const secretKey = getBotTokenSecretKey(secretToken);

		const result = validateInitData(queryString, secretKey);

		expect(result).toBe(true);
	});

	test("validateAndParseInitData() with secretKey", () => {
		const secretKey = getBotTokenSecretKey(secretToken);

		const result = validateAndParseInitData(queryString, secretKey);

		expect(result).not.toBe(false);
		expect(result).toEqual({
			auth_date: 1723409203,
			chat_instance: "-431068947458840694",
			chat_type: "private",
			hash: "5854de54c66e52cba3e438dd61658406c9f0216d8c783f9e9af80f514692273b",
			user: {
				id: 617580375,
				first_name: "kravets",
				allows_write_to_pm: true,
				is_premium: true,
				language_code: "ru",
				last_name: "",
				username: "noname2544",
			},
		});
	});
});

test("getBotTokenSecretKey returns Buffer", () => {
	const secretKey = getBotTokenSecretKey(secretToken);

	expect(secretKey).toBeInstanceOf(Buffer);
});
