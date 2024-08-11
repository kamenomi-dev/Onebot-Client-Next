import { Client } from "./client.js";
import { Member } from "./group.js";
import { Segment, TElements } from "./message.js";

export type TGender = "male" | "female" | "unknown";

export type TUserInfo = {
  user_id: number;
  nickname: string;
};

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

  /**
   * SendLike 点赞
   * @param times 点赞次数，最多为 10，默认为 1 。
   */
  public SendLike(times?: number) {
    return this.client.CallApi("send_like", { user_id: this.user_id, times });
  }

  /**
   * SendMessage (send_private_msg) 发送私聊消息
   * @param message 要发送的内容。
   */
  public SendMessage(message: TElements, auto_escape: boolean = false) {
    return this.client.CallApi("send_private_msg", {
      user_id: this.user_id,
      message,
      auto_escape,
    });
  }

  /**
   * SendForwardMessage (send_private_forward_msg) 发送私聊合并转发消息
   * @param messages 要发送的合并转发内容。
   */
  public SendForwardMessage(messages: Segment.TSegment[]) {
    return this.client.CallApi("send_private_forward_msg", {
      user_id: this.user_id,
      messages,
    });
  }
}

// @ts-ignore // Skip here, We need to call "as" from Friend, not User.
export class Friend extends User {
  public info: TFriendInfo;

  public constructor(client: Client, user_id: number) {
    super(client, user_id);
    this.info = <TFriendInfo>client.friend_map.get(this.user_id);
  }

  public static As(client: Client, uid: number) {
    const friendInfo = client.friend_map.get(uid);

    if (!friendInfo) {
      throw new Error("Can't find friend: " + uid);
    }

    return new Friend(client, uid);
  }
}
