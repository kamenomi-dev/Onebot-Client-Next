import { TAnonymous, TStatus } from "./interface";
import { TGender, TStrangerInfo } from "./user";
export declare namespace Segment {
    type TSegmentBase = {
        type: string;
        data: Record<string, string | number | boolean | undefined>;
    };
    type TSegmentText = TSegmentBase & {
        type: "text";
        data: {
            text: string;
        };
    };
    type TSegmentFace = TSegmentBase & {
        type: "face";
        data: {
            /**
             * 表情索引，取值范围在 0~221
             */
            id: number;
        };
    };
    type TSegmentImage = TSegmentBase & {
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
    type TSegmentRecord = Omit<TSegmentImage, "type"> & {
        type: "record";
    };
    type TSegmentVideo = Omit<TSegmentImage, "type"> & {
        type: "video";
    };
    type TSegmentAt = TSegmentBase & {
        type: "at";
        data: {
            qq: number | "all";
        };
    };
    type TSegmentRPS = TSegmentBase & {
        type: "rps";
        data: {};
    };
    type TSegmentDice = TSegmentBase & {
        type: "dice";
        data: {};
    };
    type TSegmentShake = TSegmentBase & {
        type: "shake";
        data: {};
    };
    type TSegmentPoke = TSegmentBase & {
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
    type TSegmentAnonymous = TSegmentBase & {
        type: "anonymous";
        data: {
            /**
             * 无法匿名时是否继续发送
             */
            ignore?: 0 | 1;
        };
    };
    type TSegmentShare = TSegmentBase & {
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
    type TSegmentContact = TSegmentBase & {
        type: "contact";
        data: {
            type: "qq" | "group";
            /**
             * id qq 对应 QQ号，group 对应 群号
             */
            id: string;
        };
    };
    type TSegmentLocation = TSegmentBase & {
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
    type TSegmentMusic = TSegmentBase & {
        type: "music";
        data: {
            type: "qq" | "163" | "xm";
            id: string;
        };
    };
    type TSegmentCustomMusic = TSegmentBase & {
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
    type TSegmentReply = TSegmentBase & {
        type: "reply";
        data: {
            /**
             * id 消息ID
             */
            id: string;
        };
    };
    type TSegmentForward = TSegmentBase & {
        type: "forward";
        data: {
            /**
             * 合并转发 ID，需要 get_forward_msg API获取
             */
            id: string;
        };
    };
    type TSegmentNode = TSegmentBase & {
        type: "node";
        data: {
            /**
             * id 消息ID
             */
            id: string;
        };
    };
    type TSegmentCustomNode = TSegmentBase & {
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
    type TSegmentXML = TSegmentBase & {
        type: "xml";
        data: {
            /**
             * data XML 消息内容
             */
            data: string;
        };
    };
    type TSegmentJSON = TSegmentBase & {
        type: "json";
        data: {
            /**
             * JSON 纯字符串内容
             */
            data: string;
        };
    };
    type TSegment = TSegmentText | TSegmentAt | TSegmentFace | TSegmentImage | TSegmentRecord | TSegmentVideo | TSegmentAnonymous | TSegmentContact | TSegmentCustomMusic | TSegmentCustomNode | TSegmentDice | TSegmentForward | TSegmentJSON | TSegmentLocation | TSegmentMusic | TSegmentNode | TSegmentPoke | TSegmentRPS | TSegmentReply | TSegmentShake | TSegmentShare | TSegmentShake | TSegmentXML;
    const segment: {
        /** @deprecated 文本，建议直接使用字符串 */
        Text(text: string): TSegmentText;
        Face(id: number): TSegmentFace;
        /** 猜拳(id=1~3) */
        Rps(): TSegmentRPS;
        /** 骰子(id=1~6) */
        Dice(): TSegmentDice;
        /** mention@提及
         * @param qq 全体成员为 all
         */
        At(qq: number | "all", text?: string, dummy?: boolean): TSegmentAt;
        /** 图片(支持http://,base64://) */
        Image(file: string, cache?: boolean, proxy?: boolean, timeout?: number): TSegmentImage;
        /** 闪照(支持http://,base64://) */
        Flash(file: string, cache?: boolean, proxy?: boolean, timeout?: number): TSegmentImage;
        /** 语音(支持http://,base64://) */
        Record(file: string | Buffer): TSegmentRecord;
        /** 视频(仅支持本地文件) */
        Video(file: string): TSegmentVideo;
        Json(data: any): TSegmentJSON;
        Xml(data: string, id?: number): TSegmentXML;
        /** 链接分享 */
        Share(url: string, title: string, image?: string, content?: string): TSegmentShare;
        /** 位置分享 */
        Location(lat: number, lng: number, address: string, id?: string): TSegmentLocation;
        /** id 0~6 */
        Poke(id: number, type: number): TSegmentPoke;
        /** @deprecated 将CQ码转换为消息链 */
        FromCqcode(strData: string): TSegment[];
    };
    function UnescapeCQ(s: string): "[" | "]" | "&" | "";
    function UnescapeCQInside(s: string): "[" | "]" | "&" | "" | ",";
    function Qs(s: string, sep?: string, equal?: string): TSegment;
}
export type TElements = string | Segment.TSegment | Array<Segment.TSegment | string>;
export declare namespace MessageEvent {
    type TEvent = {
        time: number;
        self_id: number;
        post_type: string;
    };
    type TMessageEvent = TEvent & {
        post_type: "message";
        sub_type: string;
        message_type: "private" | "group";
        message_id: number;
        user_id: number;
        font: number;
        message: TElements;
        raw_message: string;
        reply(message: TElements, auto_escape?: boolean): void;
    };
    type TPrivateMessageEvent = TMessageEvent & {
        message_type: "private";
        sub_type: "friend" | "group" | "other";
        sender: TStrangerInfo;
    };
    type TGroupMemberSender = {
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
    type TGroupMessageEvent = TMessageEvent & {
        message_type: "group";
        sub_type: "normal" | "anonymous" | "notice";
        group_id: number;
        anonymous: TAnonymous | null;
        sender: TGroupMemberSender;
        reply(message: TElements, auto_escape?: boolean, at_sender?: boolean, deleteMsg?: boolean, operator_action?: {
            kick?: boolean;
            ban: boolean;
            ban_duration?: number;
        }): void;
    };
}
export declare namespace NoticeEvent {
    type TNoticeEvent = MessageEvent.TEvent & {
        post_type: "notice";
        notice_type: string;
    };
    type TFile = {
        id: string;
        name: string;
        size: number;
        busid: number;
    };
    type TGroupFileUploadEvent = TNoticeEvent & {
        notice_type: "group_upload";
        group_id: number;
        user_id: number;
        file: TFile;
    };
    type TGroupAdminChangeEvent = TNoticeEvent & {
        notice_type: "group_admin";
        sub_type: "set" | "unset";
        group_id: number;
        user_id: number;
    };
    type TGroupMemberDecreaseEvent = TNoticeEvent & {
        notice_type: "group_decrease";
        sub_type: "leave" | "kick" | "kick_me";
        group_id: number;
        operator_id: number;
        user_id: number;
    };
    type TGroupMemberIncreaseEvent = TNoticeEvent & {
        notice_type: "group_increase";
        sub_type: "approve" | "invite";
        group_id: number;
        operator_id: number;
        user_id: number;
    };
    type TGroupMuteEvent = TNoticeEvent & {
        notice_type: "group_ban";
        sub_type: "ban" | "lift_ban";
        group_id: number;
        operator_id: number;
        user_id: number;
        duration: number;
    };
    type TFriendAddEvent = TNoticeEvent & {
        notice_type: "friend_add";
        user_id: number;
    };
    type TGroupMessageRecallEvent = TNoticeEvent & {
        notice_type: "group_recall";
        group_id: number;
        user_id: number;
        operator_id: number;
        message_id: number;
    };
    type TFriendMessageRecallevent = TNoticeEvent & {
        notice_type: "griend_recall";
        user_id: number;
        message_id: number;
    };
}
export declare namespace RequestEvent {
    type TRequestEvent = MessageEvent.TEvent & {
        post_type: "request";
        request_type: "friend";
    };
    type TFriendInviteEvent = TRequestEvent & {
        post_type: "request";
        request_type: "friend";
        user_id: number;
        comment: string;
        flag: string;
    };
    type TMemberAddOrInviteEvent = TRequestEvent & {
        post_type: "request";
        request_type: "group";
        sub_type: "add" | "invite";
        group_id: number;
        user_id: number;
        comment: string;
        flag: string;
    };
}
export declare namespace MetaEvent {
    type TMetaEvent = {
        post_type: "meta_event";
        meta_event_type: string;
    };
    type TLifeCycleEvent = MessageEvent.TEvent & {
        post_type: "meta_event";
        meta_event_type: "lifecycle";
        sub_type: "enable" | "disable" | "connect";
    };
    type THeartbeatEvent = MessageEvent.TEvent & {
        post_type: "meta_event";
        meta_event_type: "heartbeat";
        status: TStatus;
        interval: number;
    };
}
//# sourceMappingURL=message.d.ts.map