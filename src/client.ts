import { TFriendInfo } from "./user.js";
import { TGroupInfo, TGroupMemberInfo } from "./group.js";
import { BaseClient, TClientConfig } from "./base_client.js";
import {
  MessageEvent,
  MetaEvent,
  NoticeEvent,
  RequestEvent,
  TElements,
} from "./message.js";

export class Client extends BaseClient {
  public friend_map = new Map<number, TFriendInfo>();
  public group_map = new Map<number, TGroupInfo>();
  public group_member_map = new Map<number, Map<number, TGroupMemberInfo>>();

  public constructor(
    public readonly bot_user_id: number,
    public readonly config: TClientConfig
  ) {
    super(bot_user_id, config);

    if (config.options?.skip_logo) {
      return;
    }

    process.stdout.write(
      `
  ____             _           _      _____ _ _            _     _   _           _   
 / __ \\           | |         | |    / ____| (_)          | |   | \\ | |         | |  
| |  | |_ __   ___| |__   ___ | |_  | |    | |_  ___ _ __ | |_  |  \\| | _____  _| |_ 
| |  | | '_ \\ / _ \\ '_ \\ / _ \\| __| | |    | | |/ _ \\ '_ \\| __| | . \` |/ _ \\ \\/ / __|
| |__| | | | |  __/ |_) | (_) | |_  | |____| | |  __/ | | | |_  | |\\  |  __/>  <| |_ 
 \\____/|_| |_|\\___|_.__/ \\___/ \\__|  \\_____|_|_|\\___|_| |_|\\__| |_| \\_|\\___/_/\\_\\\\__|
    
          ${"=".repeat(84 - 10 * 2)}
`
    );
  }

  /**
   * Connect to websocket server.
   * @async
   */
  public async Start() {
    let connectHandler = (err: object) => {
      throw new Error("Fatal! more info see: " + JSON.stringify(err));
    };
    this.on("error", connectHandler);

    await this.Connect();

    this.logger.info("Successfully Connect Server! ");
    this.off("error", connectHandler);

    let loginInfo = await this.GetLoginInfo();
    if (loginInfo.user_id != this.bot_user_id) {
      this.logger.warn(
        `You are trying to control a incorrect account, default is ${this.bot_user_id}. But now, current is ${loginInfo.user_id}`
      );
    }

    // Get group and friend information, to be quick and tiny.

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

    this.logger.info(
      `Current account: ${loginInfo.nickname}(${loginInfo.user_id}) `
    );
    this.logger.info(
      `Loaded ${this.friend_map.size} friends and ${this.group_map.size} groups. `
    );

    // Register event listener

    this.InitEventListener();
    this.logger.info(`All event listener was registered. `);
    return this;
  }

  /**
   * Disconnect to the websocket server.
   */
  public Stop() {
    this.Disconnect();
  }

  private InitEventListener() {
    this.connection?.on("message", (rawData) => {
      const data = <MessageEvent.TEvent>JSON.parse(rawData.toString());

      // Message

      if (data.post_type == "message") {
        const messageData = <MessageEvent.TMessageEvent>data;
        const eventName = [
          "message",
          messageData.message_type,
          messageData.sub_type,
        ]
          .filter(Boolean)
          .join(".");

        // Apply same quick operation.

        messageData.reply = (message, ...args: any[]) => {
          this.QuickReply(messageData, message, ...args);
        };

        if (messageData.message_type == "private") {
          this.EmitEvent(eventName, messageData);
          return;
        }

        let messageEvent = <MessageEvent.TGroupMessageEvent>messageData;

        // Apply quick operation.

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

      // Notice, Without any operation.

      if (data.post_type == "notice") {
        const messageData = <NoticeEvent.TNoticeEvent>data;
        const eventName = ["notice", messageData.notice_type]
          .filter(Boolean)
          .join(".");

        this.EmitEvent(eventName, messageData);
        return;
      }

      // Request

      if (data.post_type == "request") {
        const messageData = <RequestEvent.TRequestEvent>data;
        const eventName = [
          "request",
          messageData.request_type,
          (<any>messageData)["sub_type"], // If request data comes from group.
        ]
          .filter(Boolean)
          .join(".");

        if (messageData.request_type == "friend") {
          let messageEvent = <RequestEvent.TFriendAddInviteEvent>data;

          // Apply quick operation.

          messageEvent.approve = (isApprove?: boolean, remark?: string) => {
            this.QuickFriendApprove(messageEvent, isApprove, remark);
          };

          this.EmitEvent(eventName, messageData);
          return;
        }

        // Apply quick operation.

        let messageEvent = <RequestEvent.TMemberAddOrInviteEvent>data;
        messageEvent.approve = (isApprove?: boolean, reason?: string) => {
          this.QuickGroupAddOrInviteApprove(messageEvent, isApprove, reason);
        };

        this.EmitEvent(eventName, messageData);
        return;
      }

      // Meta

      if (data.post_type == "meta_event") {
        const messageData = <MetaEvent.TMetaEvent>data;
        const eventName = ["meta_event", messageData.meta_event_type]
          .filter(Boolean)
          .join(".");

        this.EmitEvent(eventName, messageData);
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
   * @deprecated
   * SetFriendAddRequest
   * @param flag 加好友请求的 flag（需从上报的数据中获得）
   * @param approve 是否同意请求，默认为 true
   * @param remark 添加后的好友备注（仅在同意时有效），默认为空
   */
  public SetFriendAddRequest(flag: string, approve?: boolean, remark?: string) {
    this.CallApi("set_friend_add_request", { flag, approve, remark });
  }

  /**
   * @deprecated
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

  /**
   * GetMsg 获取消息
   * @param message_id 消息ID
   */
  public GetMsg(message_id: number) {
    return this.CallApi("get_msg", { message_id });
  }

  /**
   * GetForwardMsg 获取合并转发消息
   * @param id 合并转发 ID
   */
  public GetForwardMsg(id: string) {
    return this.CallApi("get_forward_msg", { id });
  }

  /**
   * DeleteMsg 撤回消息
   * @param message_id 消息 ID
   */
  public DeleteMsg(message_id: number) {
    return this.CallApi("delete_msg", { message_id });
  }

  /**
   * GetStrangerInfo 获取陌生人信息
   * @param user_id QQ 号
   */
  public GetStrangerInfo(user_id: number) {
    return this.CallApi("get_stranger_info", { user_id });
  }

  /**
   * GetFriendList 获取好友列表
   */
  public GetFriendList() {
    return this.CallApi("get_friend_list");
  }

  /**
   * GetGroupList 获取群聊列表
   */
  public GetGroupList() {
    return this.CallApi("get_group_list");
  }

  /**
   * GetGroupMemberList 获取群成员列表
   * @param group_id 群号
   */
  public GetGroupMemberList(group_id: number) {
    return this.CallApi("get_group_member_list", { group_id });
  }

  /**
   * GetStatus 获取运行状态
   */
  public GetStatus() {
    return this.CallApi("get_status");
  }

  /**
   * GetLoginInfo 获取登录号信息
   */
  public GetLoginInfo() {
    return this.CallApi("get_login_info");
  }

  /**
   * GetVersionInfo 获取版本信息
   * @returns 本接口仅提供最基础的属性，其他属性见所使用的 Bot 框架文档
   */
  public GetVersionInfo() {
    return this.CallApi("get_version_info");
  }

  /**
   * GetCookies 获取Cookies
   * @param domain 需要获取 cookies 的域名，默认为空
   */
  public GetCookies(domain: string) {
    return this.CallApi("get_cookies", { domain });
  }

  /**
   * GetCsrfToken 获取 CSRF Token
   */
  public GetCsrfToken() {
    return this.CallApi("get_csrf_token");
  }

  /**
   * GetCredentials 获取 QQ 相关接口凭证
   * @param domain 需要获取 cookies 的域名，默认为空
   */
  public GetCredentails(domain?: string) {
    return this.CallApi("get_credentials", { domain });
  }

  /**
   * CanSendImage 检查是否可以发送图片
   */
  public CanSendImage() {
    return this.CallApi("can_send_image");
  }

  /**
   * CanSendRecord 检查是否可以发送语音
   */
  public CanSendRecord() {
    return this.CallApi("can_send_record");
  }

  /**
   * SetRestart 重启 OneBot 实现
   * @param delay 要延迟的毫秒数，如果默认情况下无法重启，可以尝试设置延迟为 2000 左右，默认为 0
   * @description 由于重启 OneBot 实现同时需要重启 API 服务，这意味着当前的 API 请求会被中断，因此需要异步地重启，接口返回的 status 是 async。
   */
  public SetRestart(delay?: number) {
    return this.CallApi("set_restart", { delay });
  }

  /**
   * CleanCache 清理缓存
   * @description 用于清理积攒了太多的缓存文件。
   */
  public CleanCache() {
    return this.CallApi("clean_cache");
  }
}
