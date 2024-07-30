import { TGroupInfo, TGroupMemberInfo } from "./group.js";
import { TElements, TMessage, MessageEvent } from "./message.js";
import { TFriendInfo, TStrangerInfo, TUserInfo } from "./user.js";

export type TStatus = { online: boolean; good: boolean };

export type TLoginInfo = {
  user_id: number;
  nickname: string;
};

export type TFileInfo = {
  /**
   * 文件的绝对路径。
   */
  file: string;
  file_name: string;
  file_size: number;
  /**
   * 文件的 base64 编码, 需要在 LLOneBot 的配置文件中开启 base64。
   */
  base64: string;
};

export type TFriendWithCategoryInfo = {
  categoryId: number;
  categroyName: string;
  categroyMbCount: number;
  buddyList: {
    uid: string;
    qid: string;
    uin: string;
    nick: string;
    remark: string;
    longNick: string;
    avatarUrl: string;
    birthday_year: number;
    birthday_month: number;
    birthday_day: number;
    sex: number;
    topTime: string;
    isBlock: boolean;
    isMsgDisturb: boolean;
    isSpecialCareOpen: boolean;
    isSpecialCareZone: boolean;
    ringId: string;
    status: number;
    qidianMasterFlag: number;
    qidianCrewFlag: number;
    qidianCrewFlag2: number;
    extStatus: number;
    categoryId: number;
    onlyChat: boolean;
    qzoneNotWatch: boolean;
    qzoneNotWatched: boolean;
    vipFlag: boolean;
    yearVipFlag: boolean;
    svipFlag: boolean;
    vipLevel: number;
    isZPlanCoupleOpen: boolean;
    zplanCoupleSceneId: number;
    teenagerFlag: number;
    studyFlag: number;
    pendantId: string;
    vipNameColorId: string;
  }[];
}[];

export type TGroupIngoreAddRequestInfo = {
  group_id: number;
  user_id: number;
  flag: string;
}[];

/**
 * 不想实现啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
 */
export type THonorMemberInfo = TUserInfo & {
  avatar: string;
};

export type TGroupHonorInfo = {
  group_id: number;
  current_talkative?: THonorMemberInfo & { day_count: number };
  talkative_list?: Array<THonorMemberInfo & { description: string }>;
  performer_list?: Array<THonorMemberInfo & { description: string }>;
  legend_list?: Array<THonorMemberInfo & { description: string }>;
  strong_newbie_list?: Array<THonorMemberInfo & { description: string }>;
  emotion_list?: Array<THonorMemberInfo & { description: string }>;
};

export interface IOnebotExports {
  ".handle_quick_operation"(params: {
    context: object;
    operation: object;
  }): void;
  send_private_msg(params: {
    user_id: number;
    message: TElements;
    auto_escape?: boolean;
  }): number;
  send_group_msg(params: {
    group_id: number;
    message: TElements;
    auto_escape?: boolean;
  }): number;
  send_msg(params: {
    message: TElements;
    message_type?: "private" | "group";
    user_id?: number;
    group_id?: number;
    auto_escape?: boolean;
  }): number;
  delete_msg(params: { message_id: number }): void;
  get_msg(params: { message_id: number }): TMessage;
  get_forward_msg(params: { id: string }): TElements;
  send_like(params: { user_id: number; times?: number }): void;
  set_group_kick(params: {
    group_id: number;
    user_id: number;
    reject_add_request?: boolean;
  }): void;
  set_group_ban(params: {
    group_id: number;
    user_id: number;
    duration?: number;
  }): void;
  set_group_anonymous_ban(params: {
    group_id: number;
    anonymous?: MessageEvent.TAnonymous;
    anonymous_flag?: string;
    duration?: number;
  }): void;
  set_group_whole_ban(params: { group_id: number; enable?: boolean }): void;
  set_group_admin(params: {
    group_id: number;
    user_id: number;
    enable?: boolean;
  }): void;
  set_group_anonymous(params: { group_id: number; enable?: boolean }): void;
  set_group_card(params: {
    group_id: number;
    user_id: number;
    card?: string;
  }): void;
  set_group_name(params: { group_id: number; group_name: string }): void;
  set_group_leave(params: { group_id: number; is_dismiss?: boolean }): void;
  set_group_special_title(params: {
    group_id: number;
    user_id: number;
    special_title?: string;
    duration?: number;
  }): void;
  set_friend_add_request(params: {
    flag: string;
    approve?: boolean;
    remark?: string;
  }): void;
  set_group_add_request(params: {
    flag: string;
    sub_type: "add" | "invite";
    approve?: boolean;
    reason?: string;
  }): void;
  get_login_info(): TLoginInfo;
  get_stranger_info(params: {
    user_id: number;
    no_cache?: boolean;
  }): TStrangerInfo;
  get_friend_list(): TFriendInfo[];
  get_group_info(params: { group_id: number; no_cache?: boolean }): TGroupInfo;
  get_group_list(): TGroupInfo[];
  get_group_member_info(params: {
    group_id: number;
    user_id: number;
    no_cache?: boolean;
  }): TGroupMemberInfo;
  get_group_member_list(params: { group_id: number }): TGroupMemberInfo[];
  get_group_honor_info(params: {
    group_id: number;
    type:
      | "talkative"
      | "performer"
      | "legend"
      | "strong_newbie"
      | "emotion"
      | "all";
  }): TGroupHonorInfo;
  get_cookies(params: { domain?: string }): { cookies: string };
  get_csrf_token(): { token: number };
  get_credentials(params: { domain?: string }): {
    cookies: string;
    token: number;
  };
  get_record(params: { file: string; out_format: string }): { file: string };
  get_image(params: { file: string }): { file: string };
  can_send_image(): { yes: boolean };
  can_send_record(): { yes: boolean };
  get_status(): TStatus;
  get_version_info(): {
    app_name: string;
    app_version: string;
    protocol_version: string;
  };
  set_restart(params: { delay?: number }): void;
  clean_cache(): void;

  /*
   * @llonebot-extension
   */
  set_qq_avatar(params: { file: string }): void;
  /**
   * @llonebot-extension
   */
  get_group_ignore_add_request(): TGroupIngoreAddRequestInfo;
  /**
   * @llonebot-extension
   */
  get_file(params: { file_id: string }): TFileInfo;
  /**
   * @llonebot-extension
   * @cq-http
   */
  download_file(params: {
    url: string;
    /**
     * @llonebot-extension
     */
    base64?: string;
    thread_count: number;
    headers: string | Array<string>;
  }): { file: string };
  /**
   * @llonebot-extension
   */
  forward_friend_single_msg(params: {
    user_id: number;
    message_id: number;
  }): void;
  /**
   * @llonebot-extension
   */
  forward_group_single_msg(params: {
    group_id: number;
    message_id: number;
  }): void;
  /**
   * @llonebot-extension
   */
  send_msg_emoji_like(params: {
    message_id: number;
    /**
     * 取值范围为 [+4, +128563]
     * @url https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType
     */
    emoji_id: number;
  }): void;
  /**
   * @llonebot-extension
   */
  get_friends_with_category(): TFriendWithCategoryInfo;
}
