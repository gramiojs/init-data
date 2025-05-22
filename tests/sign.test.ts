import {
	parseInitData,
	serializeInitData,
	signInitData,
	validateInitData,
} from "../src/index.ts";

import { describe, expect, it } from "bun:test";

const BOT_TOKEN = "12312312:ABCDEFGHIJKLMNOPQRSTUVWXYZ";

describe("object input handling", () => {
	it("should sign parsed object input", () => {
		const unsignedObject = {
			auth_date: Math.floor(Date.now() / 1000),
			user: {
				id: 123,
				first_name: "Object",
				last_name: "User",
				username: "object_user",
			},
		};

		const signedObject = signInitData(unsignedObject, BOT_TOKEN);
		const isValid = validateInitData(signedObject, BOT_TOKEN);
		const parsed = parseInitData(signedObject);

		expect(isValid).toBeTrue();
		expect(parsed.hash).toBeString();
		console.log(parsed);
		expect(parsed).toMatchObject(unsignedObject);
	});

	it("should maintain all properties when signing object", () => {
		const fullObject = {
			query_id: "AAHdF_E4AAAAANwX8ThV_J1d",
			auth_date: Math.floor(Date.now() / 1000),
			user: {
				id: 123456789,
				first_name: "Full",
				last_name: "Object",
				username: "full_object",
			},
			chat: {
				id: -1001234567890,
				title: "Test Chat",
				type: "group",
			},
			chat_type: "private",
			chat_instance: "1234567890",
		} as const;

		const signed = signInitData(fullObject, BOT_TOKEN);
		const isValid = validateInitData(signed, BOT_TOKEN);

		expect(isValid).toBeTrue();
		expect(signed).toBeString();
	});

	it("should sign parsed object input", () => {
		
	})
});
