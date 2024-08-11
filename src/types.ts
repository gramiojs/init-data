/**
 * Known type of chat.
 */
export type WebAppChatType =
	| "sender"
	| "private"
	| "group"
	| "supergroup"
	| "channel";

/**
 * This object contains the data of the Mini App user.
 */
export type WebAppUser<isReceiver extends boolean = false> = {
	/**
	 * A unique identifier for the user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. It has at most 52 significant bits, so a 64-bit integer or a double-precision float type is safe for storing this identifier.
	 */
	id: number;
	/**
	 * First name of the user or bot.
	 */
	firstName: string;
	/**
	 * Last name of the user or bot.
	 */
	lastName?: string;
	/**
	 * Username of the user or bot.
	 */
	username?: string;
	/**
	 * True, if this user is a Telegram Premium user.
	 */
	isPremium?: boolean;
	/**
	 * True, if this user added the bot to the attachment menu.
	 */
	addedToAttachmentMenu?: boolean;
	/**
	 * True, if this user allowed the bot to message them.
	 */
	allowsWriteToPm?: boolean;

	/**
	 * URL of the user’s profile photo. The photo can be in .jpeg or .svg
	 * formats. Only returned for Mini Apps launched from the attachment menu.
	 */
	photoUrl?: string;
} & (isReceiver extends true
	? {
			/**
			 * True, if this user is a bot. Returns in the {@link WebAppInitData.receiver} field only.
			 */
			isBot?: boolean;
		}
	: {
			/**
			 * [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the user's language.
			 * Returns in {@link WebAppInitData.user} field only.
			 */
			languageCode?: string;
		});

/**
 * This object represents a chat.
 */
export interface WebAppChat {
	/**
	 * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
	 */
	id: number;
	/**
	 * Type of the chat.
	 */
	type: "group" | "supergroup" | "channel";
	/**
	 * Title of the chat.
	 */
	title: string;
	/**
	 * Username of the chat.
	 */
	username?: string;
	/**
	 * URL of the chat’s photo. The photo can be in .jpeg or .svg formats.
	 * Only returned for Mini Apps launched from the attachment menu.
	 */
	photoUrl?: string;
}

/**
 * This object contains data that is transferred to the Mini App when it is opened. It is empty if the Mini App was launched from a [keyboard button](https://core.telegram.org/bots/webapps#keyboard-button-mini-apps) or from [inline mode](https://core.telegram.org/bots/webapps#inline-mode-mini-apps).
 */
export interface WebAppInitData {
	/**
	 * A unique identifier for the Mini App session, required for sending
	 * messages via the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
	 */
	queryId?: string;
	/**
	 * An object containing data about the current user.
	 */
	user?: WebAppUser;
	/**
	 * An object containing data about the chat partner of the current user in
	 * the chat where the bot was launched via the attachment menu.
	 * Returned only for private chats and only for Mini Apps launched
	 * via the attachment menu.
	 */
	receiver?: WebAppUser<true>;
	/**
	 * An object containing data about the chat where the bot was launched via the attachment menu.
	 * Returned for supergroups, channels and group chats – only for Mini Apps launched via the attachment menu.
	 */
	chat?: WebAppChat;
	/**
	 * Type of the chat from which the Mini App was opened.
	 */
	chatType?: WebAppChatType;
	/**
	 * A global identifier indicating the chat from which Mini App was opened. Returned only for
	 * applications opened by direct link.
	 */
	chatInstance?: string;
	/**
	 * The value of the `startattach` parameter, passed [via link](https://core.telegram.org/bots/webapps#adding-bots-to-the-attachment-menu). Only returned for Mini Apps when launched from the attachment menu via link.
	 *
	 * The value of the `start_param` parameter will also be passed in the GET-parameter `tgWebAppStartParam`, so the Mini App can load the correct interface right away.
	 */
	startParam?: string;
	/**
	 * Time in seconds, after which a message can be sent via the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
	 */
	canSendAfter?: number;
	/**
	 * Unix time when the form was opened.
	 */
	authDate: number;

	/**
	 * A hash of all passed parameters, which the bot server can use to
	 * check their [validity](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app).
	 */
	hash: string;
}

export type Optional<T> = {
	[P in keyof T]: T[P] | undefined;
};
