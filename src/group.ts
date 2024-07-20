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

export class Group {
  private memberMap = new Map<number, Member>();

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
        this.memberMap.set(user_id, Member.As(client, group_id, user_id));
      });
    }
  }

  get info() {
    return <TGroupInfo>this.client.group_map.get(this.group_id);
  }

  set info(info) {
    this.client.group_map.set(this.group_id, info);
  }

  public async GetInfo(cache: boolean = false) {
    if (cache) {
      return this.info;
    }
    this.info = await this.client.CallApi("get_group_info", { group_id: this.group_id, no_cache: true });
    return this.info;
  }

  public PickMember(user_id: number) {
    return Member.As(this.client, this.group_id, user_id);
  }

  public KickMember(user_id: number, reject_add_request?: boolean) {
    return this.client.CallApi("set_group_kick", {
      group_id: this.group_id,
      user_id,
      reject_add_request,
    });
  }

  public MuteMember(member_id: number, duration?: number) {
    return this.client.CallApi("set_group_ban", {
      group_id: this.group_id,
      user_id: member_id,
      duration,
    });
  }

  public MuteAnonymous(anonymous_flag: string, duration?: number) {
    return this.client.CallApi("set_group_anonymous_ban", { group_id: this.group_id, anonymous_flag, duration });
  }

  public MuteAll(enable?: boolean) {
    return this.client.CallApi("set_group_whole_ban", { group_id: this.group_id, enable });
  }

  public SetAdmin(member_id: number, enable?: boolean) {
    return this.client.CallApi("set_group_admin", {
      group_id: this.group_id,
      user_id: member_id,
      enable,
    });
  }

  public SetMemberCard(member_id: number, card: string) {
    return this.client.CallApi("set_group_card", { group_id: this.group_id, user_id: member_id, card });
  }

  public SetName(group_name: string) {
    return this.client.CallApi("set_group_name", { group_id: this.group_id, group_name });
  }

  public Quit(is_dismiss?: boolean) {
    return this.client.CallApi("set_group_leave", { group_id: this.group_id, is_dismiss });
  }

  public SetMemberTitle(member_id: number, title: string, duration?: number) {
    return this.client.CallApi("set_group_special_title", {
      group_id: this.group_id,
      user_id: member_id,
      special_title: title,
      duration,
    });
  }

  public SendMsg(message: TElements, auto_escape?: boolean) {
    return this.client.CallApi("send_group_msg", { group_id: this.group_id, message, auto_escape });
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

  public constructor(client: Client, public readonly group_id: number, public readonly user_id: number) {
    super(client, user_id);

    this.info = <TGroupMemberInfo>client.group_member_map.get(group_id)?.get(user_id);
    this.group = Group.As(client, group_id);
  }

  
  public Kick(reject_add_request?: boolean) {
    return this.group.KickMember(this.user_id, reject_add_request);
  }

  public Mute(duration?: number) {
    return this.group.MuteMember(this.user_id, duration);
  }

  public SsetAdmin(enable?: boolean) {
    return this.group.SetAdmin(this.user_id, enable);
  }

  public SetCard(card: string) {
    return this.group.SetMemberCard(this.user_id, card);
  }

  public SetTitle(title: string, duration?: number) {
    return this.group.SetMemberTitle(this.user_id, title, duration);
  }
}
