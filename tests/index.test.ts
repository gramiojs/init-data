import { describe, expect, it, test } from "bun:test";
import {
	parseInitData,
	validateAndParseInitData,
	validateInitData,
} from "../src";

const nowDate = Date.now();

const queryString =
	"user=%7B%22id%22%3A617580375%2C%22first_name%22%3A%22kravets%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22noname2544%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-431068947458840694&chat_type=private&auth_date=1723409203&hash=5854de54c66e52cba3e438dd61658406c9f0216d8c783f9e9af80f514692273b";

const secretToken = process.env.TOKEN;
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
			queryId: "1",
			user: {
				id: 1,
				firstName: "Durov",
				languageCode: "ru",
			},
			authDate: nowDate,
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
			authDate: 1723409203,
			chatInstance: "-431068947458840694",
			chatType: "private",
			hash: "5854de54c66e52cba3e438dd61658406c9f0216d8c783f9e9af80f514692273b",
			user: {
				id: 617580375,
				firstName: "kravets",
				allowsWriteToPm: true,
				isPremium: true,
				languageCode: "ru",
				lastName: "",
				username: "noname2544",
			},
		});
	});
});
