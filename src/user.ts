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

export class User {
  public constructor(public client: Client, public readonly user_id: number) {}

  public static As(this: Client, user_id: number) {
    return new User(this, Number(user_id));
  }

  public AsStrangerInfo(user_id: number) {
    return this.client.GetStrangerInfo(user_id);
  }

  public AsFriend() {
    return Friend.As(this.client, this.user_id);
  }
  public AsMember(group_id: number) {
    return Member.As(this.client, group_id, this.user_id);
  }

  public SendLike(times?: number) {
    return this.client.CallApi("send_like", { user_id: this.user_id, times });
  }
}

export class Friend {
  public info: TFriendInfo;

  public constructor(private client: Client, protected user_id: number) {
    this.info = <TFriendInfo>client.friend_map.get(this.user_id);
  }

  public static As(client: Client, uid: number) {
    const friendInfo = client.friend_map.get(uid);

    if (!friendInfo) {
      throw new Error("Can't find friend: " + uid);
    }

    return new Friend(client, uid);
  }

  public SendMsg(message: TElements) {
    return this.client.CallApi("send_private_msg", { user_id: this.user_id, message });
  }
}
