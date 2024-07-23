import { BaseClient, TClientConfig } from "./base_client";
import { TGroupInfo, TGroupMemberInfo } from "./group";
import { TElements } from "./message";
import { TFriendInfo } from "./user";
export declare class Client extends BaseClient {
    readonly bot_user_id: number;
    readonly config: TClientConfig;
    friend_map: Map<number, TFriendInfo>;
    group_map: Map<number, TGroupInfo>;
    group_member_map: Map<number, Map<number, TGroupMemberInfo>>;
    constructor(bot_user_id: number, config: TClientConfig);
    Start(): Promise<void>;
    private EventProcessorInit;
    /**
     * @debug
     * SetFriendAddRequest
     * @param flag 加好友请求的 flag（需从上报的数据中获得）
     * @param approve 是否同意请求，默认为 true
     * @param remark 添加后的好友备注（仅在同意时有效），默认为空
     */
    SetFriendAddRequest(flag: string, approve?: boolean, remark?: string): void;
    /**
     * @debug
     * SetGroupAddRequest
     * @param flag 加群请求的 flag（需从上报的数据中获得）
     * @param sub_type add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
     * @param approve 是否同意请求／邀请，默认为 true
     * @param reason 拒绝理由（仅在拒绝时有效），more为空
     */
    SetGroupAddRequest(flag: string, sub_type: "add" | "invite", approve?: boolean, reason?: string): void;
    GetMsg(message_id: number): Promise<{
        time: number;
        message_type: string;
        message_id: number;
        real_id: number;
        sender: import("./user").TStrangerInfo;
        message: TElements;
    }>;
    GetForwardMsg(id: string): Promise<TElements>;
    DeleteMsg(message_id: number): Promise<void>;
    GetStrangerInfo(user_id: number): Promise<import("./user").TStrangerInfo>;
    GetFriendList(): Promise<TFriendInfo[]>;
    GetGroupList(): Promise<TGroupInfo[]>;
    GetGroupMemberList(group_id: number): Promise<TGroupMemberInfo[]>;
    GetStatus(): Promise<import("./interface").TStatus>;
    GetLoginInfo(): Promise<{
        user_id: number;
        nickname: string;
    }>;
    GetVersionInfo(): Promise<{
        app_name: string;
        app_version: string;
        protocol_version: string;
    }>;
    GetCookies(domain: string): Promise<{
        cookies: string;
    }>;
    GetCsrfToken(): Promise<{
        token: number;
    }>;
    GetCredentails(domain: string): Promise<{
        cookies: string;
        token: number;
    }>;
    CanSendImage(): Promise<{
        yes: boolean;
    }>;
    CanSendRecord(): Promise<{
        yes: boolean;
    }>;
    SetRestart(delay?: number): Promise<void>;
    CleanCache(): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map