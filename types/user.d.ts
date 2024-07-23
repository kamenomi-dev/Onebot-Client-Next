import { Client } from "./client";
import { Member } from "./group";
import { TElements } from "./message";
export type TGender = "male" | "female" | "unknown";
export type TStrangerInfo = {
    user_id: number;
    nickname: string;
    sex: TGender;
    age: number;
};
export type TFriendInfo = {
    user_id: number;
    nickname: string;
    remark: string;
};
export declare class User {
    client: Client;
    readonly user_id: number;
    constructor(client: Client, user_id: number);
    static As(this: Client, user_id: number): User;
    AsStrangerInfo(user_id: number): Promise<TStrangerInfo>;
    AsFriend(): Friend;
    AsMember(group_id: number): Member;
    SendLike(times?: number): Promise<void>;
}
export declare class Friend {
    private client;
    protected user_id: number;
    info: TFriendInfo;
    constructor(client: Client, user_id: number);
    static As(client: Client, uid: number): Friend;
    SendMsg(message: TElements): Promise<number>;
}
//# sourceMappingURL=user.d.ts.map