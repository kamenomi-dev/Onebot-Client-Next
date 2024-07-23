import { Client } from "./client";
import { MessageEvent, TElements } from "./message";
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

export class Group {
  private member_map = new Map<number, Member>();

  public static As(client: Client, group_id: number) {
    let groupInfo = client.group_map.get(group_id);

    if (!groupInfo) {
      throw new Error(`Can't find group ${group_id}`);
    }

    return new Group(client, group_id);
  }

  public constructor(private client: Client, public readonly group_id: number) {
    let memberMap = this.client.group_member_map.get(group_id);
    if (memberMap) {
      [...memberMap.keys()].forEach((user_id) => {
        this.member_map.set(user_id, Member.As(client, group_id, user_id));
      });
    }
  }

  get info() {
    return <TGroupInfo>this.client.group_map.get(this.group_id);
  }

  set info(info) {
    this.client.group_map.set(this.group_id, info);
  }

  /**
   * GetInfo (get_group_info) 获取群信息
   * @param cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快），默认为 false。
   */
  public async GetInfo(cache: boolean = false) {
    if (cache) {
      return this.info;
    }
    this.info = await this.client.CallApi("get_group_info", {
      group_id: this.group_id,
      no_cache: true,
    });
    return this.info;
  }

  /**
   * GetHonorMembers (get_group_honor_info) 获取群荣誉信息
   * @param type 要获取的群荣誉类型，可传入 talkative performer legend strong_newbie emotion 以分别获取单个类型的群荣誉数据，或传入 all 获取所有数据。
   */
  public GetHonorMembers(
    type:
      | "talkative"
      | "performer"
      | "legend"
      | "strong_newbie"
      | "emotion"
      | "all"
  ) {
    return this.client.CallApi("get_group_honor_info", this.group_id, type);
  };

  public PickMember(user_id: number) {
    return Member.As(this.client, this.group_id, user_id);
  }

  /**
   * KickMember (set_group_kick) 群组踢人
   * @param user_id 要踢的 QQ 号
   * @param reject_add_request 拒绝此人的加群请求，默认为 false
   */
  public KickMember(user_id: number, reject_add_request: boolean = false) {
    return this.client.CallApi("set_group_kick", {
      group_id: this.group_id,
      user_id,
      reject_add_request,
    });
  }

  /**
   * MuteMember (set_group_ban) 群组单人禁言
   * @param user_id 要禁言的 QQ 号
   * @param duration 禁言时长，单位秒，0 表示取消禁言，默认为 30*60 秒（30 分钟）。
   */
  public MuteMember(user_id: number, duration: number = 1800) {
    return this.client.CallApi("set_group_ban", {
      group_id: this.group_id,
      user_id,
      duration,
    });
  }

  /**
   * MuteAnonymous (set_group_anonymous_ban) 群组匿名用户禁言
   * @param anonymous 要禁言的匿名用户对象（群消息上报的 anonymous 字段），可选。
   * @param anonymous_flag 要禁言的匿名用户的 flag（需从群消息上报的数据中获得），可选。
   * @param duration 禁言时长，单位秒，无法取消匿名用户禁言，默认为 30*60 秒（30分钟）。
   */
  public MuteAnonymous(
    anonymous?: MessageEvent.TAnonymous,
    anonymous_flag?: string,
    duration?: number
  ) {
    return this.client.CallApi("set_group_anonymous_ban", {
      group_id: this.group_id,
      anonymous,
      anonymous_flag,
      duration,
    });
  }

  /**
   * MuteAll (set_group_whole_ban) 群组全员禁言
   * @param enable 是否禁言，默认为 true。
   */
  public MuteAll(enable: boolean = true) {
    return this.client.CallApi("set_group_whole_ban", {
      group_id: this.group_id,
      enable,
    });
  }

  /**
   * SetAdmin (set_group_anonymous) 群组匿名
   * @param user_id 要设置管理员的 QQ 号。
   * @param enable true 为设置，false 为取消，默认为 true。
   * @returns
   */
  public SetAdmin(user_id: number, enable: boolean = true) {
    return this.client.CallApi("set_group_admin", {
      group_id: this.group_id,
      user_id,
      enable,
    });
  }

  /**
   * SetMemberCard (set_group_card) 设置群名片（群备注）
   * @param user_id 要设置的 QQ 号。
   * @param card 群名片内容，不填或空字符串表示删除群名片，默认为 空。
   */
  public SetMemberCard(user_id: number, card?: string) {
    return this.client.CallApi("set_group_card", {
      group_id: this.group_id,
      user_id,
      card,
    });
  }

  /**
   * SetName (set_group_name) 设置群名
   * @param group_name 新群名。
   */
  public SetName(group_name: string) {
    return this.client.CallApi("set_group_name", {
      group_id: this.group_id,
      group_name,
    });
  }

  /**
   * Quit (set_group_leave) 退出群组
   * @param is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散，默认为 false。
   */
  public Quit(is_dismiss: boolean = false) {
    return this.client.CallApi("set_group_leave", {
      group_id: this.group_id,
      is_dismiss,
    });
  }

  /**
   * SetMemberTitle (set_group_special_title) 设置群组专属头衔
   * @param user_id 要设置的 QQ 号。
   * @param special_title 专属头衔，不填或空字符串表示删除专属头衔，可选。
   * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试，默认为 -1。
   */
  public SetMemberTitle(
    user_id: number,
    special_title?: string,
    duration: number = -1
  ) {
    return this.client.CallApi("set_group_special_title", {
      group_id: this.group_id,
      user_id,
      special_title,
      duration,
    });
  }

  /**
   * SendMsg (send_group_msg) 发送群消息
   * @param message 要发送的内容。
   * @param auto_escape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效，默认为 false。
   */
  public SendMsg(message: TElements, auto_escape: boolean = false) {
    return this.client.CallApi("send_group_msg", {
      group_id: this.group_id,
      message,
      auto_escape,
    });
  }
}

// @ts-expect-error
export class Member extends User {
  public group: Group;
  public readonly info: TGroupMemberInfo;

  public static As(client: Client, group_id: number, user_id: number) {
    let memberInfo = client.group_member_map.get(group_id)?.get(user_id);

    if (!memberInfo) {
      throw new Error(`Cant find member ${user_id} in group ${group_id}`);
    }

    return new Member(client, group_id, user_id);
  }

  public constructor(
    client: Client,
    public readonly group_id: number,
    public readonly user_id: number
  ) {
    super(client, user_id);

    this.info = <TGroupMemberInfo>(
      client.group_member_map.get(group_id)?.get(user_id)
    );
    this.group = Group.As(client, group_id);
  }

  /**
   * Kick 群组踢人
   * @param reject_add_request 拒绝此人的加群请求，默认为 false。
   */
  public Kick(reject_add_request?: boolean) {
    return this.group.KickMember(this.user_id, reject_add_request);
  }

  /**
   * Mute 群组单人禁言
   * @param duration 禁言时长，单位秒，默认为 30*60 秒，(30 分钟)。
   */
  public Mute(duration: number = 1800) {
    return this.group.MuteMember(this.user_id, duration);
  }

  /**
   * SetAdmin 群组设置管理员
   * @param enable true 为设置，false 为取消，默认为 true。
   */
  public SetAdmin(enable: boolean = true) {
    return this.group.SetAdmin(this.user_id, enable);
  }

  /**
   * SetCard 设置群名片（群备注）
   * @param card 群名片内容，不填或空字符串表示删除群名片，默认为 空。
   */
  public SetCard(card?: string) {
    return this.group.SetMemberCard(this.user_id, card);
  }

  /**
   * SetSpecialTitle 设置群组专属头衔
   * @param special_title 专属头衔，不填或空字符串表示删除专属头衔，默认为 空。
   * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试，默认为 -1。
   */
  public SetSpecialTitle(special_title?: string, duration: number = -1) {
    return this.group.SetMemberTitle(this.user_id, special_title, duration);
  }
}
