import { TAnonymous, TStatus } from "./interface";
import { TGender, TStrangerInfo } from "./user";

export namespace Segment {
  export type TSegmentBase = {
    type: string;
    data: Record<string, string | number | boolean | undefined>;
  };

  /* 纯文本 */
  export type TSegmentText = TSegmentBase & {
    type: "text";
    data: {
      text: string;
    };
  };

  /* QQ表情 */
  export type TSegmentFace = TSegmentBase & {
    type: "face";
    data: {
      /**
       * 表情索引，取值范围在 0~221
       */
      id: number;
    };
  };

  /* 图片 */
  export type TSegmentImage = TSegmentBase & {
    type: "image";
    data: {
      /**
       * 支持URI格式的绝对路径、网络 URL 以及 Base64 编码
       */
      file: string;
      type?: "flash";
      /**
       * 接收图片时 url 不为空
       */
      url?: string;
      /**
       * 使用已缓存图片，默认为 1
       */
      cache?: 0 | 1;
      /**
       * 是否通过代理下载图片，默认为 1
       */
      proxy?: 0 | 1;
      /**
       * 下载图片的超时时间，默认不超时
       */
      timeout?: number;
    };
  };

  /* 语音 */
  export type TSegmentRecord = Omit<TSegmentImage, "type"> & {
    type: "record";
  };

  /* 短视频 */
  export type TSegmentVideo = Omit<TSegmentImage, "type"> & {
    type: "video";
  };

  /* At */
  export type TSegmentAt = TSegmentBase & {
    type: "at";
    data: {
      qq: number | "all";
    };
  };

  /* 猜拳魔法表情 */
  export type TSegmentRPS = TSegmentBase & {
    type: "rps";
    data: {};
  };

  /* 掷骰子魔法表情 */
  export type TSegmentDice = TSegmentBase & {
    type: "dice";
    data: {};
  };

  /* 窗口抖动 (戳一戳) */
  export type TSegmentShake = TSegmentBase & {
    type: "shake";
    data: {};
  };

  /* 戳一戳 */
  export type TSegmentPoke = TSegmentBase & {
    type: "poke";
    data: {
      /**
       * type 戳一戳类型，取值范围为 1~126
       */
      type: number;
      id: number;
      /**
       * name 接收时存在
       */
      name?: string;
    };
  };

  /* 匿名消息 */
  export type TSegmentAnonymous = TSegmentBase & {
    type: "anonymous";
    data: {
      /**
       * 无法匿名时是否继续发送
       */
      ignore?: 0 | 1;
    };
  };

  /* 链接分享 */
  export type TSegmentShare = TSegmentBase & {
    type: "share";
    data: {
      url: string;
      title: string;
      /**
       * content 内容描述，可选
       */
      content?: string;
      /**
       * url 图片 URL
       */
      image?: string;
    };
  };

  /* 推荐好友/群聊 */
  export type TSegmentContact = TSegmentBase & {
    type: "contact";
    data: {
      type: "qq" | "group";
      /**
       * id qq 对应 QQ号，group 对应 群号
       */
      id: string;
    };
  };

  export type TSegmentLocation = TSegmentBase & {
    type: "location";
    data: {
      /**
       * lat 维度
       */
      lat: string;
      /**
       * lan 精度
       */
      lon: string;
      /**
       * title 标题，可选
       */
      title?: string;
      /**
       * content 内容描述，可选
       */
      content?: string;
    };
  };

  export type TSegmentMusic = TSegmentBase & {
    type: "music";
    data: {
      type: "qq" | "163" | "xm";
      id: string;
    };
  };

  export type TSegmentCustomMusic = TSegmentBase & {
    type: "music";
    data: {
      type: "custom";
      /**
       * url 跳转链接
       */
      url: string;
      /**
       * audio 音乐 URL
       */
      audio: string;
      /**
       * title 标题
       */
      title: string;
      /**
       * content 内容描述，可选
       */
      content?: string;
      /**
       * image 图片 URL，可选
       */
      image?: string;
    };
  };

  export type TSegmentReply = TSegmentBase & {
    type: "reply";
    data: {
      /**
       * id 消息ID
       */
      id: string;
    };
  };

  export type TSegmentForward = TSegmentBase & {
    type: "forward";
    data: {
      /**
       * 合并转发 ID，需要 get_forward_msg API获取
       */
      id: string;
    };
  };

  export type TSegmentNode = TSegmentBase & {
    type: "node";
    data: {
      /**
       * id 消息ID
       */
      id: string;
    };
  };

  export type TSegmentCustomNode = TSegmentBase & {
    type: "node";
    data: {
      /**
       * user_id 发送者 QQ 号
       */
      user_id: string;
      /**
       * nickname 发送者昵称
       */
      nickname: string;
      /**
       * content 消息内容
       */
      content: string | TElements;
    };
  };

  export type TSegmentXML = TSegmentBase & {
    type: "xml";
    data: {
      /**
       * data XML 消息内容
       */
      data: string;
    };
  };

  export type TSegmentJSON = TSegmentBase & {
    type: "json";
    data: {
      /**
       * JSON 纯字符串内容
       */
      data: string;
    };
  };

  export type TSegment =
    | TSegmentText
    | TSegmentAt
    | TSegmentFace
    | TSegmentImage
    | TSegmentRecord
    | TSegmentVideo
    | TSegmentAnonymous
    | TSegmentContact
    | TSegmentCustomMusic
    | TSegmentCustomNode
    | TSegmentDice
    | TSegmentForward
    | TSegmentJSON
    | TSegmentLocation
    | TSegmentMusic
    | TSegmentNode
    | TSegmentPoke
    | TSegmentRPS
    | TSegmentReply
    | TSegmentShake
    | TSegmentShare
    | TSegmentShake
    | TSegmentXML;

  export const segment = {
    /** @deprecated 文本，建议直接使用字符串 */
    Text(text: string): TSegmentText {
      return {
        type: "text",
        data: {
          text,
        },
      };
    },

    Face(id: number): TSegmentFace {
      return {
        type: "face",
        data: {
          id,
        },
      };
    },

    /** 猜拳(id=1~3) */
    Rps(): TSegmentRPS {
      return {
        type: "rps",
        data: {},
      };
    },

    /** 骰子(id=1~6) */
    Dice(): TSegmentDice {
      return {
        type: "dice",
        data: {},
      };
    },

    /** mention@提及
     * @param qq 全体成员为 all
     */
    At(qq: number | "all", text?: string, dummy?: boolean): TSegmentAt {
      return {
        type: "at",
        data: {
          qq,
          text,
          dummy,
        },
      };
    },

    /** 图片(支持http://,base64://) */
    Image(
      file: string,
      cache?: boolean,
      proxy?: boolean,
      timeout?: number
    ): TSegmentImage {
      return {
        type: "image",
        data: {
          file,
          cache: cache != undefined ? (cache ? 1 : 0) : undefined,
          proxy: proxy != undefined ? (proxy ? 1 : 0) : undefined,
          timeout,
        },
      };
    },

    /** 闪照(支持http://,base64://) */
    Flash(
      file: string,
      cache?: boolean,
      proxy?: boolean,
      timeout?: number
    ): TSegmentImage {
      return {
        type: "image",
        data: {
          type: "flash",
          file,
          cache: cache != undefined ? (cache ? 1 : 0) : undefined,
          proxy: proxy != undefined ? (proxy ? 1 : 0) : undefined,
          timeout,
        },
      };
    },

    /** 语音(支持http://,base64://) */
    Record(file: string | Buffer): TSegmentRecord {
      return {
        type: "record",
        data: {
          file: file.toString(),
        },
      };
    },

    /** 视频(仅支持本地文件) */
    Video(file: string): TSegmentVideo {
      return {
        type: "video",
        data: {
          file,
        },
      };
    },

    Json(data: any): TSegmentJSON {
      return {
        type: "json",
        data: { data: JSON.stringify(data) },
      };
    },

    Xml(data: string, id?: number): TSegmentXML {
      return {
        type: "xml",
        data: {
          data,
          id,
        },
      };
    },

    /** 链接分享 */
    Share(
      url: string,
      title: string,
      image?: string,
      content?: string
    ): TSegmentShare {
      return {
        type: "share",
        data: {
          url,
          title,
          image,
          content,
        },
      };
    },

    /** 位置分享 */
    Location(
      lat: number,
      lng: number,
      address: string,
      id?: string
    ): TSegmentLocation {
      return {
        type: "location",
        data: {
          lat: String(lat),
          lon: String(lng),
          address,
          id,
        },
      };
    },

    /** id 0~6 */
    Poke(id: number, type: number): TSegmentPoke {
      return {
        type: "poke",
        data: {
          id,
          type,
        },
      };
    },

    /** @deprecated 将CQ码转换为消息链 */
    FromCqcode(strData: string) {
      const resultElements: TSegment[] = [];
      const matchedTokens = strData.matchAll(/\[CQ:[^\]]+\]/g);
      let prevIdx = 0;

      for (let token of matchedTokens) {
        const text = strData
          .slice(prevIdx, token.index)
          .replace(/&#91;|&#93;|&amp;/g, UnescapeCQ);

        if (text) {
          resultElements.push({ type: "text", data: { text } });
        }

        const element = token[0];
        let cq = element.replace("[CQ:", "type=");
        cq = cq.substr(0, cq.length - 1);

        resultElements.push(Qs(cq));
        prevIdx = (token.index as number) + element.length;
      }

      if (prevIdx < strData.length) {
        const text = strData
          .slice(prevIdx)
          .replace(/&#91;|&#93;|&amp;/g, UnescapeCQ);
        if (text) {
          resultElements.push({ type: "text", data: { text } });
        }
      }
      return resultElements;
    },
  };

  export function UnescapeCQ(s: string) {
    if (s === "&#91;") return "[";
    if (s === "&#93;") return "]";
    if (s === "&amp;") return "&";
    return "";
  }

  export function UnescapeCQInside(s: string) {
    if (s === "&#44;") return ",";
    if (s === "&#91;") return "[";
    if (s === "&#93;") return "]";
    if (s === "&amp;") return "&";
    return "";
  }

  export function Qs(s: string, sep = ",", equal = "=") {
    const ret: any = {};
    const split = s.split(sep);
    for (let v of split) {
      const i = v.indexOf(equal);
      if (i === -1) continue;
      ret[v.substring(0, i)] = v
        .substr(i + 1)
        .replace(/&#44;|&#91;|&#93;|&amp;/g, UnescapeCQInside);
    }
    for (let k in ret) {
      try {
        if (k !== "text") ret[k] = JSON.parse(ret[k]);
      } catch {}
    }
    return ret as TSegment;
  }
}

export type TElements =
  | string
  | Segment.TSegment
  | Array<Segment.TSegment | string>;

export namespace MessageEvent {
  export type TEvent = {
    time: number;
    self_id: number;
    post_type: string;
  };

  export type TMessageEvent = TEvent & {
    post_type: "message";
    sub_type: string;
    message_type: "private" | "group";
    message_id: number;
    user_id: number;
    font: number;
    message: TElements;
    raw_message: string;
    reply(message: TElements, at_sender?: boolean, auto_escape?: boolean): void;
  };

  export type TPrivateMessageEvent = TMessageEvent & {
    message_type: "private";
    sub_type: "friend" | "group" | "other";
    sender: TStrangerInfo;
  };

  export type TGroupMemberSender = {
    user_id: number;
    nickname: string;
    card: string;
    sex: TGender;
    age: number;
    area: string;
    level: string;
    role: string;
    title: string;
  };

  export type TGroupMessageEvent = TMessageEvent & {
    message_type: "group";
    sub_type: "normal" | "anonymous" | "notice";
    group_id: number;
    anonymous: TAnonymous | null;
    sender: TGroupMemberSender;
    reply(message: TElements, at_sender?: boolean, auto_escape?: boolean): void;
    recall(): void;
    kick(): void;
    mute(ban_duration?: number): void;
  };

  export type TPrivateMessageEventMap = {
    "message.private"(event: TPrivateMessageEvent): void;
    "message.private.friend"(
      event: TPrivateMessageEvent & { sub_type: "friend" }
    ): void;
    "message.private.group"(
      event: TPrivateMessageEvent & { sub_type: "group" }
    ): void;
    "message.private.other"(
      event: TPrivateMessageEvent & { sub_type: "other" }
    ): void;
  };

  export type TGroupMessageEventMap = {
    "message.group"(event: TGroupMessageEvent): void;
    "message.group.normal"(
      event: TGroupMessageEvent & { sub_type: "normal" }
    ): void;
    "message.group.anonymous"(
      event: TGroupMessageEvent & { sub_type: "anonymous" }
    ): void;
    "message.group.notice"(
      event: TGroupMessageEvent & { sub_type: "notice" }
    ): void;
  };
}

export namespace NoticeEvent {
  export type TNoticeEvent = MessageEvent.TEvent & {
    post_type: "notice";
    notice_type: string;
  };

  export type TFile = {
    id: string;
    name: string;
    size: number;
    busid: number;
  };

  export type TGroupFileUploadEvent = TNoticeEvent & {
    notice_type: "group_upload";
    group_id: number;
    user_id: number;
    file: TFile;
  };

  export type TGroupAdminChangeEvent = TNoticeEvent & {
    notice_type: "group_admin";
    sub_type: "set" | "unset";
    group_id: number;
    user_id: number;
  };

  export type TGroupMemberDecreaseEvent = TNoticeEvent & {
    notice_type: "group_decrease";
    sub_type: "leave" | "kick" | "kick_me";
    group_id: number;
    operator_id: number;
    user_id: number;
  };

  export type TGroupMemberIncreaseEvent = TNoticeEvent & {
    notice_type: "group_increase";
    sub_type: "approve" | "invite";
    group_id: number;
    operator_id: number;
    user_id: number;
  };

  export type TGroupMuteEvent = TNoticeEvent & {
    notice_type: "group_ban";
    sub_type: "ban" | "lift_ban";
    group_id: number;
    operator_id: number;
    user_id: number;
    duration: number;
  };

  export type TFriendAddEvent = TNoticeEvent & {
    notice_type: "friend_add";
    user_id: number;
  };

  export type TGroupMessageRecallEvent = TNoticeEvent & {
    notice_type: "group_recall";
    group_id: number;
    user_id: number;
    operator_id: number;
    message_id: number;
  };

  export type TFriendMessageRecallevent = TNoticeEvent & {
    notice_type: "friend_recall";
    user_id: number;
    message_id: number;
  };

  export type TGroupNoticeEventMap = {
    "notice"(
      event:
        | TGroupFileUploadEvent
        | TGroupAdminChangeEvent
        | TGroupMemberDecreaseEvent
        | TGroupMemberIncreaseEvent
        | TGroupMuteEvent
        | TGroupMessageRecallEvent
    ): void;
    "notice.group_upload"(event: TGroupFileUploadEvent): void;
    "notice.group_admin"(event: TGroupAdminChangeEvent): void;
    "notice.group_decrease"(event: TGroupMemberDecreaseEvent): void;
    "notice.group_increase"(event: TGroupMemberIncreaseEvent): void;
    "notice.group_ban"(event: TGroupMuteEvent): void;
    "notice.group_recall"(event: TGroupMessageRecallEvent): void;
  };

  export type TFriendNoticeEventMap = {
    "notice"(event: TFriendAddEvent | TFriendMessageRecallevent): void;
    "notice.friend_add"(event: TFriendAddEvent): void;
    "notice.friend_recall"(event: TFriendMessageRecallevent): void;
  };
}

export namespace RequestEvent {
  export type TRequestEvent = MessageEvent.TEvent & {
    post_type: "request";
    request_type: "friend";
  };

  export type TFriendInviteEvent = TRequestEvent & {
    post_type: "request";
    request_type: "friend";
    user_id: number;
    comment: string;
    flag: string;
  };

  export type TMemberAddOrInviteEvent = TRequestEvent & {
    post_type: "request";
    request_type: "group";
    sub_type: "add" | "invite";
    group_id: number;
    user_id: number;
    comment: string;
    flag: string;
  };

  export type TGroupRequestEventMap = {
    "request"(event: TMemberAddOrInviteEvent): void;
    "request.group.add"(
      event: TMemberAddOrInviteEvent & { sub_type: "add" }
    ): void;
    "request.group.invite"(
      event: TMemberAddOrInviteEvent & { sub_type: "invite" }
    ): void;
  };

  export type TFriendRequestEventMap = {
    "request"(event: TFriendInviteEvent): void;
    "requst.friend"(event: TFriendInviteEvent): void;
  };
}

export namespace MetaEvent {
  export type TMetaEvent = {
    post_type: "meta_event";
    meta_event_type: string;
  };

  export type TLifeCycleEvent = MessageEvent.TEvent & {
    post_type: "meta_event";
    meta_event_type: "lifecycle";
    sub_type: "enable" | "disable" | "connect";
  };

  export type THeartbeatEvent = MessageEvent.TEvent & {
    post_type: "meta_event";
    meta_event_type: "heartbeat";
    status: TStatus;
    interval: number;
  };

  export type TMetaEventMap = {
    "meta_event"(event: TLifeCycleEvent | THeartbeatEvent): void;
    "meta_event.lifecycle"(event: TLifeCycleEvent): void;
    "meta_event.heartbeat"(event: THeartbeatEvent): void;
  };
}
