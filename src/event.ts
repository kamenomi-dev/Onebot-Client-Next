import { MessageEvent, NoticeEvent, RequestEvent } from "./message.js";

export namespace OnebotClient {
  export type MessageEventMap = {
    "message"(
      event: MessageEvent.TPrivateMessageEvent | MessageEvent.TGroupMemberSender
    ): void;
  } & {
    [P in keyof MessageEvent.TPrivateMessageEventMap]: MessageEvent.TPrivateMessageEventMap[P];
  } & {
    [P in keyof MessageEvent.TGroupMessageEventMap]: MessageEvent.TGroupMessageEventMap[P];
  };

  export type NoticeEventMap = {
    "notice"(
      event:
        | Parameters<NoticeEvent.TGroupNoticeEventMap["notice"]>["0"]
        | Parameters<NoticeEvent.TFriendNoticeEventMap["notice"]>["0"]
    ): void;
  } & {
    [P in keyof NoticeEvent.TFriendNoticeEventMap]: NoticeEvent.TFriendNoticeEventMap[P];
  } & {
    [P in keyof NoticeEvent.TGroupNoticeEventMap]: NoticeEvent.TGroupNoticeEventMap[P];
  };

  export type RequestEventMap = {
    "request"(
      event:
        | Parameters<RequestEvent.TFriendRequestEventMap["request"]>["0"]
        | Parameters<RequestEvent.TGroupRequestEventMap["request"]>
    ): void;
  } & {
    [P in keyof RequestEvent.TFriendRequestEventMap]: RequestEvent.TFriendRequestEventMap[P];
  } & {
    [P in keyof RequestEvent.TGroupRequestEventMap]: RequestEvent.TGroupRequestEventMap[P];
  };

  export type EventMap = MessageEventMap & NoticeEventMap & RequestEventMap;
}
