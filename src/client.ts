import { BaseClient, TClientConfig } from "./base_client";
import { OnebotClient } from "./event";
import { TGroupInfo, TGroupMemberInfo } from "./group";
import { MessageEvent, NoticeEvent, TElements } from "./message";
import { TFriendInfo } from "./user";

export class Client extends BaseClient<OnebotClient.EventMap> {
  public friend_map = new Map<number, TFriendInfo>();
  public group_map = new Map<number, TGroupInfo>();
  public group_member_map = new Map<number, Map<number, TGroupMemberInfo>>();

  public constructor(
    public readonly bot_user_id: number,
    public readonly config: TClientConfig
  ) {
    super(bot_user_id, config);
  }

  public async Start() {
    await this.Connect();

    let friendList = await this.GetFriendList();
    for (const friendInfo of friendList) {
      this.friend_map.set(friendInfo.user_id, friendInfo);
    }

    let groupList = await this.GetGroupList();
    for (const groupInfo of groupList) {
      let memberMap = new Map<number, TGroupMemberInfo>();
      let memberList = await this.GetGroupMemberList(groupInfo.group_id);

      for (const memberInfo of memberList) {
        memberMap.set(memberInfo.user_id, memberInfo);
      }

      this.group_map.set(groupInfo.group_id, groupInfo);
      this.group_member_map.set(groupInfo.group_id, memberMap);
    }

    this.EventProcessorInit();
  }

  public Stop() {
    this.Disconnect();
  }

  private EventProcessorInit() {
    this.connection?.on("message", (rawData) => {
      const data = <MessageEvent.TEvent>JSON.parse(rawData.toString());

      // Message

      if (data.post_type == "message") {
        let messageData = <MessageEvent.TMessageEvent>data;
        const eventName = [
          "message",
          messageData.message_type,
          messageData.sub_type,
        ].join(".");

        messageData.reply = (message, ...args: any[]) => {
          this.QuickReply(messageData, message, ...args);
        };

        if (messageData.message_type == "private") {
          this.EmitEvent(eventName, messageData);
          return;
        }

        let messageEvent = <MessageEvent.TGroupMessageEvent>messageData;

        messageEvent.reply = (message: TElements, ...args: any[]) => {
          this.QuickReply(messageEvent, message, ...args);
        };

        messageEvent.recall = () => {
          this.QuickRecall(messageEvent);
        };

        messageEvent.kick = () => {
          this.QuickKick(messageEvent);
        };

        messageEvent.mute = (time?: number) => {
          this.QuickMute(messageEvent, time);
        };

        this.EmitEvent(eventName, messageEvent);
        return;
      }

      // Notice

      if (data.post_type == "notice") {
        let msgData = <NoticeEvent.TNoticeEvent>data;
        const eventName = ["notice", msgData.notice_type].join(".");

        this.EmitEvent(eventName, msgData);
        return;
      }
    });
  }

  private EmitEvent(eventName: string, data: object, isBubble?: boolean) {
    if (!isBubble) {
      this.emit(<any>eventName, data);
      return;
    }

    let eventBlock = eventName.split(".");

    for (let _event of eventBlock) {
      this.emit(<any>eventBlock.join("."), data);

      eventBlock.pop();
    }
  }

  /**
   * @debug
   * SetFriendAddRequest
   * @param flag 加好友请求的 flag（需从上报的数据中获得）
   * @param approve 是否同意请求，默认为 true
   * @param remark 添加后的好友备注（仅在同意时有效），默认为空
   */
  public SetFriendAddRequest(flag: string, approve?: boolean, remark?: string) {
    this.CallApi("set_friend_add_request", { flag, approve, remark });
  }

  /**
   * @debug
   * SetGroupAddRequest
   * @param flag 加群请求的 flag（需从上报的数据中获得）
   * @param sub_type add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
   * @param approve 是否同意请求／邀请，默认为 true
   * @param reason 拒绝理由（仅在拒绝时有效），more为空
   */
  public SetGroupAddRequest(
    flag: string,
    sub_type: "add" | "invite",
    approve?: boolean,
    reason?: string
  ) {
    this.CallApi("set_group_add_request", { flag, sub_type, approve, reason });
  }

  public GetMsg(message_id: number) {
    return this.CallApi("get_msg", { message_id });
  }

  public GetForwardMsg(id: string) {
    return this.CallApi("get_forward_msg", { id });
  }

  public DeleteMsg(message_id: number) {
    return this.CallApi("delete_msg", { message_id });
  }

  public GetStrangerInfo(user_id: number) {
    return this.CallApi("get_stranger_info", { user_id });
  }

  public GetFriendList() {
    return this.CallApi("get_friend_list");
  }

  public GetGroupList() {
    return this.CallApi("get_group_list");
  }

  public GetGroupMemberList(group_id: number) {
    return this.CallApi("get_group_member_list", { group_id });
  }

  public GetStatus() {
    return this.CallApi("get_status");
  }

  public GetLoginInfo() {
    return this.CallApi("get_login_info");
  }

  public GetVersionInfo() {
    return this.CallApi("get_version_info");
  }

  public GetCookies(domain: string) {
    return this.CallApi("get_cookies", { domain });
  }

  public GetCsrfToken() {
    return this.CallApi("get_csrf_token");
  }

  public GetCredentails(domain: string) {
    return this.CallApi("get_credentials", { domain });
  }

  public CanSendImage() {
    return this.CallApi("can_send_image");
  }

  public CanSendRecord() {
    return this.CallApi("can_send_record");
  }

  public SetRestart(delay?: number) {
    return this.CallApi("set_restart", { delay });
  }

  public CleanCache() {
    return this.CallApi("clean_cache");
  }
}
