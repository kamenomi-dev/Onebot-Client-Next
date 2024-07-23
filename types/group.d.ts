import { Client } from "./client";
import { TElements } from "./message";
import { TGender, User } from "./user";
export type TGroupInfo = {
    group_id: number;
    group_name: string;
    member_count: number;
    max_member_count: number;
};
export type TGroupRole = "owner" | "admin" | "member";
export type TGroupMemberInfo = {
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
export declare class Group {
    private client;
    readonly group_id: number;
    private memberMap;
    static As(client: Client, group_id: number): Group;
    constructor(client: Client, group_id: number);
    get info(): TGroupInfo;
    set info(info: TGroupInfo);
    GetInfo(cache?: boolean): Promise<TGroupInfo>;
    PickMember(user_id: number): Member;
    KickMember(user_id: number, reject_add_request?: boolean): Promise<void>;
    MuteMember(member_id: number, duration?: number): Promise<void>;
    MuteAnonymous(anonymous_flag: string, duration?: number): Promise<void>;
    MuteAll(enable?: boolean): Promise<void>;
    SetAdmin(member_id: number, enable?: boolean): Promise<void>;
    SetMemberCard(member_id: number, card: string): Promise<void>;
    SetName(group_name: string): Promise<void>;
    Quit(is_dismiss?: boolean): Promise<void>;
    SetMemberTitle(member_id: number, title: string, duration?: number): Promise<void>;
    SendMsg(message: TElements, auto_escape?: boolean): Promise<number>;
}
export declare class Member extends User {
    readonly group_id: number;
    readonly user_id: number;
    group: Group;
    readonly info: TGroupMemberInfo;
    static As(client: Client, group_id: number, user_id: number): Member;
    constructor(client: Client, group_id: number, user_id: number);
    Kick(reject_add_request?: boolean): Promise<void>;
    Mute(duration?: number): Promise<void>;
    SsetAdmin(enable?: boolean): Promise<void>;
    SetCard(card: string): Promise<void>;
    SetTitle(title: string, duration?: number): Promise<void>;
}
//# sourceMappingURL=group.d.ts.map