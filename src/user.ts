import { Client } from "./client.js";
import { Member } from "./group.js";
import { TElements } from "./message.js";

export type TGender = "male" | "female" | "unknown";

export type TUserInfo = {
  user_id: number;
  nickname: string;
}

export type TStrangerInfo = TUserInfo & {
  sex: TGender;
  age: number;
};

export type TFriendInfo = TUserInfo & {
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

  /**
   * SendMsg (send_private_msg) 发送私聊消息
   * @param message 要发送的内容。
   */
  public SendMsg(message: TElements, auto_escape: boolean = false) {
    return this.client.CallApi("send_private_msg", { user_id: this.user_id, message, auto_escape });
  }

  /**
   * SendLike (send_like) 发送好友赞
   * @param times 赞的次数，每个好友每天最多 10 次，默认为 1。
   */
  public SendLike(times: number = 1) {
    return this.client.CallApi("send_like", { user_id: this.user_id, times })
  }
}
