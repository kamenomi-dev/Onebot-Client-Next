import { Logger } from 'ts-log';
import WebSocket from 'ws';
import { EventEmitter } from 'eventemitter3';

declare enum ELoggerLevel {
    debug = 0,
    trace = 1,
    info = 2,
    warn = 3,
    error = 4
}
declare class ClientLogger implements Logger {
    private readonly logLevel;
    logger: Console;
    constructor(logLevel?: ELoggerLevel);
    debug(message?: any, ...optionalParams: any[]): void;
    trace(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

type TGender = "male" | "female" | "unknown";
type TUserInfo = {
    user_id: number;
    nickname: string;
};
type TStrangerInfo = TUserInfo & {
    sex: TGender;
    age: number;
};
type TFriendInfo = TUserInfo & {
    remark: string;
};
declare class User {
    client: Client;
    readonly user_id: number;
    constructor(client: Client, user_id: number);
    static As(this: Client, user_id: number): User;
    AsStrangerInfo(user_id: number): Promise<TStrangerInfo>;
    AsFriend(): Friend;
    AsMember(group_id: number): Member;
    /**
     * SendLike 点赞
     * @param times 点赞次数，最多为 10，默认为 1 。
     */
    SendLike(times?: number): Promise<void>;
    /**
     * SendMessage (send_private_msg) 发送私聊消息
     * @param message 要发送的内容。
     */
    SendMessage(message: TElements, auto_escape?: boolean): Promise<number>;
    /**
     * SendForwardMessage (send_private_forward_msg) 发送私聊合并转发消息
     * @param messages 要发送的合并转发内容。
     */
    SendForwardMessage(messages: Segment.TSegment[]): Promise<{
        message_id: number;
        forward_id: number;
    }>;
}
declare class Friend extends User {
    info: TFriendInfo;
    constructor(client: Client, user_id: number);
    static As(client: Client, uid: number): Friend;
}

type TBaseClientEventMap = {
    "data"(data: TApiCallback): void;
    "open"(event: WebSocket.Event): void;
    "error"(event: WebSocket.ErrorEvent): void;
    "close"(event: WebSocket.CloseEvent): void;
};
type TClientConfig = {
    websocket_address: string;
    accent_token?: string;
    options?: {
        skip_logo?: boolean;
        log_level?: ELoggerLevel;
    };
};
declare class BaseClient extends EventEmitter<OnebotClient.EventMap & TBaseClientEventMap> {
    readonly bot_user_id: number;
    readonly config: TClientConfig;
    connection?: WebSocket;
    logger: ClientLogger;
    constructor(bot_user_id: number, config: TClientConfig);
    /**
     * Connect to Websocket Server
     * @async
     */
    Connect(): Promise<void>;
    /**
     * Disconnect to the Websocket Server
     */
    Disconnect(): void;
    /**
     * CallApi
     * @param action api
     * @param args arguments of api
     */
    CallApi<T extends keyof IOnebotExports, R extends IOnebotExports[T]>(action: T, ...args: Parameters<R>): Promise<ReturnType<R>>;
    /**
     * @ignore Internal methods
     */
    QuickCallApi(context: object, operation: object): Promise<void>;
    /**
     * @ignore Internal methods, common message operation
     */
    QuickReply(from: MessageEvent.TMessageEvent, context: TElements, auto_escape?: boolean, at_sender?: boolean): Promise<void>;
    /**
     * @ignore Internal methods, common message operation
     */
    QuickRecall(from: MessageEvent.TGroupMessageEvent): Promise<void>;
    /**
     * @ignore Internal methods, common group message operation
     */
    QuickKick(from: MessageEvent.TGroupMessageEvent): Promise<void>;
    /**
     * @ignore Internal methods, common group message operation
     */
    QuickMute(from: MessageEvent.TGroupMessageEvent, ban_duration?: number): Promise<void>;
    /**
     * @ignore Internal methods, friend add request operation
     */
    QuickFriendApprove(from: RequestEvent.TFriendAddInviteEvent, isApprove?: boolean, remark?: string): Promise<void>;
    /**
     * @ignore Internal methods, group add or request request operation
     */
    QuickGroupAddOrInviteApprove(from: RequestEvent.TMemberAddOrInviteEvent, isApprove?: boolean, reason?: string): Promise<void>;
    Send(data: Record<string, any>): void;
    private __OpenHandler;
    private __MessageHandler;
    private __ErrorHandler;
    private __CloseHandler;
}

declare class Client extends BaseClient {
    readonly bot_user_id: number;
    readonly config: TClientConfig;
    friend_map: Map<number, TFriendInfo>;
    group_map: Map<number, TGroupInfo>;
    group_member_map: Map<number, Map<number, TGroupMemberInfo>>;
    constructor(bot_user_id: number, config: TClientConfig);
    /**
     * Connect to websocket server.
     * @async
     */
    Start(): Promise<this>;
    /**
     * Disconnect to the websocket server.
     */
    Stop(): void;
    private InitEventListener;
    private EmitEvent;
    /**
     * GetFriendsWithCategory 获取附有分组信息的好友列表
     */
    GetFriendsWithCategory(): Promise<TFriendWithCategoryInfo>;
    /**
     * SetAvatar (set_qq_avatar) 设置群头像
     * @param file 支持URI格式的绝对路径、网络 URL 以及 Base64 编码。
     */
    SetAvatar(file: string): void;
    /**
     * GetFile (get_file) 下载群/私聊文件
     * @param file_id 文件ID。
     */
    GetFile(file_id: string): Promise<TFileInfo>;
    /**
     * DownloadFile (download_file) 下载文件
     */
    DownloadFile(url: string, thread_count: number, headers: string | Array<string>, base64?: string): Promise<{
        file: string;
    }>;
    /**
     * SetFriendAddRequest 处理好友添加请求
     * @param flag 加好友请求的 flag（需从上报的数据中获得）。
     * @param approve 是否同意请求，默认为 true。
     * @param remark 添加后的好友备注（仅在同意时有效），默认为空。
     */
    SetFriendAddRequest(flag: string, approve?: boolean, remark?: string): void;
    /**
     * SetGroupAddRequest 处理群聊成员添加请求
     * @param flag 加群请求的 flag（需从上报的数据中获得）。
     * @param sub_type add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）。
     * @param approve 是否同意请求／邀请，默认为 true。
     * @param reason 拒绝理由（仅在拒绝时有效），默认为空。
     */
    SetGroupAddRequest(flag: string, sub_type: "add" | "invite", approve?: boolean, reason?: string): void;
    /**
     * @deprecated
     * SetMessageEmojiLike (set_msg_emoji_like)
     * @param message_id 消息ID。
     * @param emoji_id 表情ID，取值范围为 [+4, +128563]。
     */
    SetMessageEmojiLike(message_id: number, emoji_id: number): void;
    /**
     * GetMsg 获取消息
     * @param message_id 消息ID。
     */
    GetMsg(message_id: number): Promise<TMessage>;
    /**
     * GetForwardMsg 获取合并转发消息
     * @param id 合并转发 ID。
     */
    GetForwardMsg(id: string): Promise<Segment.TSegment[]>;
    /**
     * DeleteMsg 撤回消息
     * @param message_id 消息 ID。
     */
    DeleteMsg(message_id: number): Promise<void>;
    /**
     * GetStrangerInfo 获取陌生人信息
     * @param user_id QQ 号。
     */
    GetStrangerInfo(user_id: number): Promise<TStrangerInfo>;
    /**
     * GetFriendList 获取好友列表
     */
    GetFriendList(): Promise<TFriendInfo[]>;
    /**
     * GetGroupList 获取群聊列表
     */
    GetGroupList(): Promise<TGroupInfo[]>;
    /**
     * GetGroupMemberList 获取群成员列表
     * @param group_id 群号。
     */
    GetGroupMemberList(group_id: number): Promise<TGroupMemberInfo[]>;
    /**
     * GetStatus 获取运行状态
     */
    GetStatus(): Promise<TStatus>;
    /**
     * GetLoginInfo 获取登录号信息
     */
    GetLoginInfo(): Promise<TLoginInfo>;
    /**
     * GetVersionInfo 获取版本信息
     * @returns 本接口仅提供最基础的属性，其他属性见所使用的 Bot 框架文档。
     */
    GetVersionInfo(): Promise<{
        app_name: string;
        app_version: string;
        protocol_version: string;
    }>;
    /**
     * GetCookies 获取Cookies
     * @param domain 需要获取 cookies 的域名，默认为空。
     */
    GetCookies(domain: string): Promise<{
        cookies: string;
    }>;
    /**
     * GetCsrfToken 获取 CSRF Token
     */
    GetCsrfToken(): Promise<{
        token: number;
    }>;
    /**
     * GetCredentials 获取 QQ 相关接口凭证
     * @param domain 需要获取 cookies 的域名，默认为空。
     */
    GetCredentails(domain?: string): Promise<{
        cookies: string;
        token: number;
    }>;
    /**
     * CanSendImage 检查是否可以发送图片
     */
    CanSendImage(): Promise<{
        yes: boolean;
    }>;
    /**
     * CanSendRecord 检查是否可以发送语音
     */
    CanSendRecord(): Promise<{
        yes: boolean;
    }>;
    /**
     * SetRestart 重启 OneBot 实现
     * @param delay 要延迟的毫秒数，如果默认情况下无法重启，可以尝试设置延迟为 2000 左右，默认为 0。
     * @description 由于重启 OneBot 实现同时需要重启 API 服务，这意味着当前的 API 请求会被中断，因此需要异步地重启，接口返回的 status 是 async。
     */
    SetRestart(delay?: number): Promise<void>;
    /**
     * CleanCache 清理缓存
     * @description 用于清理积攒了太多的缓存文件。
     */
    CleanCache(): Promise<void>;
}

type TGroupInfo = {
    group_id: number;
    group_name: string;
    member_count: number;
    max_member_count: number;
};
type TGroupRole = "owner" | "admin" | "member";
type TGroupMemberInfo = {
    group_id: number;
    user_id: number;
    nickname: string;
    card: string;
    sex: TGender;
    age: number;
    area: string;
    join_time: number;
    last_sent_time: number;
    level: string;
    role: TGroupRole;
    unfriendly: boolean;
    title: string;
    title_expire_time: number;
    card_changeable: boolean;
};
declare class Group {
    private client;
    readonly group_id: number;
    private member_map;
    static As(client: Client, group_id: number): Group;
    constructor(client: Client, group_id: number);
    get info(): TGroupInfo;
    set info(info: TGroupInfo);
    /**
     * GetInfo (get_group_info) 获取群信息
     * @param cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快），默认为 false。
     */
    GetInfo(cache?: boolean): Promise<TGroupInfo>;
    /**
     * GetIgnoreAddRequest (get_group_ignore_add_request) 获取已过滤的加群通知
     */
    GetIgnoreAddRequest(): Promise<TGroupIngoreAddRequestInfo>;
    /**
     * UploadFile (upload_group_file) 上传群文件
     * @param file 本地文件绝对路径
     * @param name 存储名称
     * @param folder 父目录ID
     */
    UploadFile(file: string, name: string, folder?: string): Promise<void>;
    /**
     * GetHonorMembers (get_group_honor_info) 获取群荣誉信息
     * @param type 要获取的群荣誉类型，可传入 talkative performer legend strong_newbie emotion 以分别获取单个类型的群荣誉数据，或传入 all 获取所有数据。
     */
    GetHonorMembers(type: "talkative" | "performer" | "legend" | "strong_newbie" | "emotion" | "all"): Promise<TGroupHonorInfo>;
    PickMember(user_id: number): Member;
    /**
     * KickMember (set_group_kick) 群组踢人
     * @param user_id 要踢的 QQ 号
     * @param reject_add_request 拒绝此人的加群请求，默认为 false
     */
    KickMember(user_id: number, reject_add_request?: boolean): Promise<void>;
    /**
     * MuteMember (set_group_ban) 群组单人禁言
     * @param user_id 要禁言的 QQ 号
     * @param duration 禁言时长，单位秒，0 表示取消禁言，默认为 30*60 秒（30 分钟）。
     */
    MuteMember(user_id: number, duration?: number): Promise<void>;
    /**
     * MuteAnonymous (set_group_anonymous_ban) 群组匿名用户禁言
     * @param anonymous 要禁言的匿名用户对象（群消息上报的 anonymous 字段），可选。
     * @param anonymous_flag 要禁言的匿名用户的 flag（需从群消息上报的数据中获得），可选。
     * @param duration 禁言时长，单位秒，无法取消匿名用户禁言，默认为 30*60 秒（30分钟）。
     */
    MuteAnonymous(anonymous?: MessageEvent.TAnonymous, anonymous_flag?: string, duration?: number): Promise<void>;
    /**
     * MuteAll (set_group_whole_ban) 群组全员禁言
     * @param enable 是否禁言，默认为 true。
     */
    MuteAll(enable?: boolean): Promise<void>;
    /**
     * SetAdmin (set_group_anonymous) 群组匿名
     * @param user_id 要设置管理员的 QQ 号。
     * @param enable true 为设置，false 为取消，默认为 true。
     * @returns
     */
    SetAdmin(user_id: number, enable?: boolean): Promise<void>;
    /**
     * SetMemberCard (set_group_card) 设置群名片（群备注）
     * @param user_id 要设置的 QQ 号。
     * @param card 群名片内容，不填或空字符串表示删除群名片，默认为 空。
     */
    SetMemberCard(user_id: number, card?: string): Promise<void>;
    /**
     * SetName (set_group_name) 设置群名
     * @param group_name 新群名。
     */
    SetName(group_name: string): Promise<void>;
    /**
     * Quit (set_group_leave) 退出群组
     * @param is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散，默认为 false。
     */
    Quit(is_dismiss?: boolean): Promise<void>;
    /**
     * SetMemberTitle (set_group_special_title) 设置群组专属头衔
     * @param user_id 要设置的 QQ 号。
     * @param special_title 专属头衔，不填或空字符串表示删除专属头衔，可选。
     * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试，默认为 -1。
     */
    SetMemberTitle(user_id: number, special_title?: string, duration?: number): Promise<void>;
    /**
     * SendMsg (send_group_msg) 发送群消息
     * @param message 要发送的内容。
     * @param auto_escape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效，默认为 false。
     */
    SendMessage(message: TElements, auto_escape?: boolean): Promise<number>;
    SendForwardMessage(messages: Segment.TSegment[]): Promise<{
        message_id: number;
        forward_id: number;
    }>;
    /**
     * GetMessageHistory (get_group_msg_history) 获取群历史消息
     * @param message_seq 获取从seq以上的消息，默认为 空，即获取最新消息。
     * @returns 获取消息类型数组，最大数组长度为 19 。
     */
    GetMessageHistory(message_seq?: number): Promise<Segment.TSegment[]>;
}
declare class Member extends User {
    readonly group_id: number;
    readonly user_id: number;
    group: Group;
    readonly info: TGroupMemberInfo;
    static As(client: Client, group_id: number, user_id: number): Member;
    constructor(client: Client, group_id: number, user_id: number);
    /**
     * Kick 群组踢人
     * @param reject_add_request 拒绝此人的加群请求，默认为 false。
     */
    Kick(reject_add_request?: boolean): Promise<void>;
    /**
     * Mute 群组单人禁言
     * @param duration 禁言时长，单位秒，默认为 30*60 秒，(30 分钟)。
     */
    Mute(duration?: number): Promise<void>;
    /**
     * SetAdmin 群组设置管理员
     * @param enable true 为设置，false 为取消，默认为 true。
     */
    SetAdmin(enable?: boolean): Promise<void>;
    /**
     * SetCard 设置群名片（群备注）
     * @param card 群名片内容，不填或空字符串表示删除群名片，默认为 空。
     */
    SetCard(card?: string): Promise<void>;
    /**
     * SetSpecialTitle 设置群组专属头衔
     * @param special_title 专属头衔，不填或空字符串表示删除专属头衔，默认为 空。
     * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试，默认为 -1。
     */
    SetSpecialTitle(special_title?: string, duration?: number): Promise<void>;
}

type TApiCallback = {
    status: "failed" | "ok";
    retcode: 0 | 1400 | 1401 | 1402 | 1403 | 1404;
    data: object | null;
    echo: any;
};
type TStatus = {
    online: boolean;
    good: boolean;
};
type TLoginInfo = {
    user_id: number;
    nickname: string;
};
type TFileInfo = {
    /**
     * 文件的绝对路径。
     */
    file: string;
    file_name: string;
    file_size: number;
    /**
     * 文件的 base64 编码, 需要在 LLOneBot 的配置文件中开启 base64。
     */
    base64: string;
};
type TFriendWithCategoryInfo = {
    categoryId: number;
    categroyName: string;
    categroyMbCount: number;
    buddyList: {
        uid: string;
        qid: string;
        uin: string;
        nick: string;
        remark: string;
        longNick: string;
        avatarUrl: string;
        birthday_year: number;
        birthday_month: number;
        birthday_day: number;
        sex: number;
        topTime: string;
        isBlock: boolean;
        isMsgDisturb: boolean;
        isSpecialCareOpen: boolean;
        isSpecialCareZone: boolean;
        ringId: string;
        status: number;
        qidianMasterFlag: number;
        qidianCrewFlag: number;
        qidianCrewFlag2: number;
        extStatus: number;
        categoryId: number;
        onlyChat: boolean;
        qzoneNotWatch: boolean;
        qzoneNotWatched: boolean;
        vipFlag: boolean;
        yearVipFlag: boolean;
        svipFlag: boolean;
        vipLevel: number;
        isZPlanCoupleOpen: boolean;
        zplanCoupleSceneId: number;
        teenagerFlag: number;
        studyFlag: number;
        pendantId: string;
        vipNameColorId: string;
    }[];
}[];
type TGroupIngoreAddRequestInfo = {
    group_id: number;
    user_id: number;
    flag: string;
}[];
/**
 * 不想实现啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
 */
type THonorMemberInfo = TUserInfo & {
    avatar: string;
};
type TGroupHonorInfo = {
    group_id: number;
    current_talkative?: THonorMemberInfo & {
        day_count: number;
    };
    talkative_list?: Array<THonorMemberInfo & {
        description: string;
    }>;
    performer_list?: Array<THonorMemberInfo & {
        description: string;
    }>;
    legend_list?: Array<THonorMemberInfo & {
        description: string;
    }>;
    strong_newbie_list?: Array<THonorMemberInfo & {
        description: string;
    }>;
    emotion_list?: Array<THonorMemberInfo & {
        description: string;
    }>;
};
interface IOnebotExports {
    ".handle_quick_operation"(params: {
        context: object;
        operation: object;
    }): void;
    send_private_msg(params: {
        user_id: number;
        message: TElements;
        auto_escape?: boolean;
    }): number;
    send_group_msg(params: {
        group_id: number;
        message: TElements;
        auto_escape?: boolean;
    }): number;
    send_msg(params: {
        message: TElements;
        message_type?: "private" | "group";
        user_id?: number;
        group_id?: number;
        auto_escape?: boolean;
    }): number;
    delete_msg(params: {
        message_id: number;
    }): void;
    get_msg(params: {
        message_id: number;
    }): TMessage;
    get_forward_msg(params: {
        id: string;
    }): Segment.TSegment[];
    send_like(params: {
        user_id: number;
        times?: number;
    }): void;
    set_group_kick(params: {
        group_id: number;
        user_id: number;
        reject_add_request?: boolean;
    }): void;
    set_group_ban(params: {
        group_id: number;
        user_id: number;
        duration?: number;
    }): void;
    set_group_anonymous_ban(params: {
        group_id: number;
        anonymous?: MessageEvent.TAnonymous;
        anonymous_flag?: string;
        duration?: number;
    }): void;
    set_group_whole_ban(params: {
        group_id: number;
        enable?: boolean;
    }): void;
    set_group_admin(params: {
        group_id: number;
        user_id: number;
        enable?: boolean;
    }): void;
    set_group_anonymous(params: {
        group_id: number;
        enable?: boolean;
    }): void;
    set_group_card(params: {
        group_id: number;
        user_id: number;
        card?: string;
    }): void;
    set_group_name(params: {
        group_id: number;
        group_name: string;
    }): void;
    set_group_leave(params: {
        group_id: number;
        is_dismiss?: boolean;
    }): void;
    set_group_special_title(params: {
        group_id: number;
        user_id: number;
        special_title?: string;
        duration?: number;
    }): void;
    set_friend_add_request(params: {
        flag: string;
        approve?: boolean;
        remark?: string;
    }): void;
    set_group_add_request(params: {
        flag: string;
        sub_type: "add" | "invite";
        approve?: boolean;
        reason?: string;
    }): void;
    get_login_info(): TLoginInfo;
    get_stranger_info(params: {
        user_id: number;
        no_cache?: boolean;
    }): TStrangerInfo;
    get_friend_list(): TFriendInfo[];
    get_group_info(params: {
        group_id: number;
        no_cache?: boolean;
    }): TGroupInfo;
    get_group_list(): TGroupInfo[];
    get_group_member_info(params: {
        group_id: number;
        user_id: number;
        no_cache?: boolean;
    }): TGroupMemberInfo;
    get_group_member_list(params: {
        group_id: number;
    }): TGroupMemberInfo[];
    get_group_honor_info(params: {
        group_id: number;
        type: "talkative" | "performer" | "legend" | "strong_newbie" | "emotion" | "all";
    }): TGroupHonorInfo;
    get_cookies(params: {
        domain?: string;
    }): {
        cookies: string;
    };
    get_csrf_token(): {
        token: number;
    };
    get_credentials(params: {
        domain?: string;
    }): {
        cookies: string;
        token: number;
    };
    get_record(params: {
        file: string;
        out_format: string;
    }): {
        file: string;
    };
    get_image(params: {
        file: string;
    }): {
        file: string;
    };
    can_send_image(): {
        yes: boolean;
    };
    can_send_record(): {
        yes: boolean;
    };
    get_status(): TStatus;
    get_version_info(): {
        app_name: string;
        app_version: string;
        protocol_version: string;
    };
    set_restart(params: {
        delay?: number;
    }): void;
    clean_cache(): void;
    set_qq_avatar(params: {
        file: string;
    }): void;
    get_group_ignore_add_request(): TGroupIngoreAddRequestInfo;
    get_file(params: {
        file_id: string;
    }): TFileInfo;
    forward_friend_single_msg(params: {
        user_id: number;
        message_id: number;
    }): void;
    forward_group_single_msg(params: {
        group_id: number;
        message_id: number;
    }): void;
    set_msg_emoji_like(params: {
        message_id: number;
        /**
         * 取值范围为 [+4, +128563]
         * @url https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType
         */
        emoji_id: number;
    }): void;
    get_friends_with_category(): TFriendWithCategoryInfo;
    send_forward_msg(): any;
    send_group_forward_msg(params: {
        group_id: number;
        messages: Segment.TSegment[];
    }): {
        message_id: number;
        forward_id: number;
    };
    send_private_forward_msg(params: {
        user_id: number;
        messages: Segment.TSegment[];
    }): {
        message_id: number;
        forward_id: number;
    };
    get_group_msg_history(params: {
        message_seq?: number;
        group_id: number;
    }): Segment.TSegment[];
    upload_group_file(params: {
        group_id: number;
        file: string;
        name: string;
        folder?: string;
    }): void;
    download_file(params: {
        url: string;
        base64?: string;
        thread_count: number;
        headers: string | Array<string>;
    }): {
        file: string;
    };
}

type TMessage = {
    time: number;
    message_type: string;
    message_id: number;
    real_id: number;
    sender: TStrangerInfo;
    message: TElements;
};
declare namespace Segment {
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
    type TSegmentFile = TSegment & {
        type: "file";
        data: {
            /**
             * 支持URI格式的绝对路径
             */
            file: string;
            name: string;
        };
    };
    type TSegmentImage = TSegmentBase & {
        type: "image";
        data: {
            /**
             * @llonebot-extension
             * 图片预览文字
             */
            summary?: string;
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
type TElements = string | Segment.TSegment | Array<Segment.TSegment>;
declare namespace MessageEvent {
    type TBaseEvent = {
        time: number;
        self_id: number;
        post_type: string;
    };
    type TMessageEvent = TBaseEvent & {
        post_type: "message";
        sub_type: string;
        message_type: "private" | "group";
        message_id: number;
        user_id: number;
        font: number;
        message: TElements;
        raw_message: string;
        reply(message: TElements, at_sender?: boolean, auto_escape?: boolean): void;
        /**
         * @deprecated
         * 本函数并非是快捷指令，也不是onebot v11协议中有的，此相关api提供自 llonebot 。
         * @param emoji_id
         */
        replyViaEmoji(emoji_id: number): void;
        /**
         * @deprecated
         * 本函数并非是快捷指令，也不是onebot v11协议中有的，此相关api提供自 llonebot 。
         * @param target_id 支持 群号或者QQ号。
         */
        forwardMessage(target_id: number): void;
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
    type TAnonymous = {
        id: number;
        name: string;
        flag: string;
    };
    type TGroupMessageEvent = TMessageEvent & {
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
    type TPrivateMessageEventMap = {
        "message.private"(event: TPrivateMessageEvent): void;
        "message.private.friend"(event: TPrivateMessageEvent & {
            sub_type: "friend";
        }): void;
        "message.private.group"(event: TPrivateMessageEvent & {
            sub_type: "group";
        }): void;
        "message.private.other"(event: TPrivateMessageEvent & {
            sub_type: "other";
        }): void;
    };
    type TGroupMessageEventMap = {
        "message.group"(event: TGroupMessageEvent): void;
        "message.group.normal"(event: TGroupMessageEvent & {
            sub_type: "normal";
        }): void;
        "message.group.anonymous"(event: TGroupMessageEvent & {
            sub_type: "anonymous";
        }): void;
        "message.group.notice"(event: TGroupMessageEvent & {
            sub_type: "notice";
        }): void;
    };
}
declare namespace NoticeEvent {
    type TNoticeEvent = MessageEvent.TBaseEvent & {
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
        notice_type: "friend_recall";
        user_id: number;
        message_id: number;
    };
    type TGroupNoticeEventMap = {
        "notice"(event: TGroupFileUploadEvent | TGroupAdminChangeEvent | TGroupMemberDecreaseEvent | TGroupMemberIncreaseEvent | TGroupMuteEvent | TGroupMessageRecallEvent): void;
        "notice.group_upload"(event: TGroupFileUploadEvent): void;
        "notice.group_admin"(event: TGroupAdminChangeEvent): void;
        "notice.group_decrease"(event: TGroupMemberDecreaseEvent): void;
        "notice.group_increase"(event: TGroupMemberIncreaseEvent): void;
        "notice.group_ban"(event: TGroupMuteEvent): void;
        "notice.group_recall"(event: TGroupMessageRecallEvent): void;
    };
    type TFriendNoticeEventMap = {
        "notice"(event: TFriendAddEvent | TFriendMessageRecallevent): void;
        "notice.friend_add"(event: TFriendAddEvent): void;
        "notice.friend_recall"(event: TFriendMessageRecallevent): void;
    };
}
declare namespace RequestEvent {
    type TRequestEvent = MessageEvent.TBaseEvent & {
        post_type: "request";
        request_type: "friend" | "group";
        user_id: number;
        comment: string;
        flag: string;
    };
    type TFriendAddInviteEvent = TRequestEvent & {
        request_type: "friend";
        approve(isApprove?: boolean, remark?: string): void;
    };
    type TMemberAddOrInviteEvent = TRequestEvent & {
        request_type: "group";
        sub_type: "add" | "invite";
        group_id: number;
        approve(isApprove?: boolean, reason?: string): void;
    };
    type TGroupRequestEventMap = {
        "request"(event: TMemberAddOrInviteEvent): void;
        "request.group.add"(event: TMemberAddOrInviteEvent & {
            sub_type: "add";
        }): void;
        "request.group.invite"(event: TMemberAddOrInviteEvent & {
            sub_type: "invite";
        }): void;
    };
    type TFriendRequestEventMap = {
        "request"(event: TFriendAddInviteEvent): void;
        "request.friend"(event: TFriendAddInviteEvent): void;
    };
}
declare namespace MetaEvent {
    type TMetaEvent = MessageEvent.TBaseEvent & {
        post_type: "meta_event";
        meta_event_type: string;
    };
    type TLifeCycleEvent = TMetaEvent & {
        post_type: "meta_event";
        meta_event_type: "lifecycle";
        sub_type: "enable" | "disable" | "connect";
    };
    type THeartbeatEvent = TMetaEvent & {
        post_type: "meta_event";
        meta_event_type: "heartbeat";
        status: TStatus;
        interval: number;
    };
    type TMetaEventMap = {
        "meta_event"(event: TLifeCycleEvent | THeartbeatEvent): void;
        "meta_event.lifecycle"(event: TLifeCycleEvent): void;
        "meta_event.heartbeat"(event: THeartbeatEvent): void;
    };
}

declare namespace OnebotClient {
    type MessageEventMap = {
        "message"(event: MessageEvent.TPrivateMessageEvent | MessageEvent.TGroupMemberSender): void;
    } & {
        [P in keyof MessageEvent.TPrivateMessageEventMap]: MessageEvent.TPrivateMessageEventMap[P];
    } & {
        [P in keyof MessageEvent.TGroupMessageEventMap]: MessageEvent.TGroupMessageEventMap[P];
    };
    type NoticeEventMap = {
        "notice"(event: Parameters<NoticeEvent.TGroupNoticeEventMap["notice"]>["0"] | Parameters<NoticeEvent.TFriendNoticeEventMap["notice"]>["0"]): void;
    } & {
        [P in keyof NoticeEvent.TFriendNoticeEventMap]: NoticeEvent.TFriendNoticeEventMap[P];
    } & {
        [P in keyof NoticeEvent.TGroupNoticeEventMap]: NoticeEvent.TGroupNoticeEventMap[P];
    };
    type RequestEventMap = {
        "request"(event: Parameters<RequestEvent.TFriendRequestEventMap["request"]>["0"] | Parameters<RequestEvent.TGroupRequestEventMap["request"]>): void;
    } & {
        [P in keyof RequestEvent.TFriendRequestEventMap]: RequestEvent.TFriendRequestEventMap[P];
    } & {
        [P in keyof RequestEvent.TGroupRequestEventMap]: RequestEvent.TGroupRequestEventMap[P];
    };
    type EventMap = MessageEventMap & NoticeEventMap & RequestEventMap;
}

export { BaseClient, Client, ClientLogger, ELoggerLevel, Friend, Group, type IOnebotExports, Member, MessageEvent, MetaEvent, NoticeEvent, OnebotClient, RequestEvent, Segment, type TApiCallback, type TBaseClientEventMap, type TClientConfig, type TElements, type TFileInfo, type TFriendInfo, type TFriendWithCategoryInfo, type TGender, type TGroupHonorInfo, type TGroupInfo, type TGroupIngoreAddRequestInfo, type TGroupMemberInfo, type TGroupRole, type THonorMemberInfo, type TLoginInfo, type TMessage, type TStatus, type TStrangerInfo, type TUserInfo, User };
