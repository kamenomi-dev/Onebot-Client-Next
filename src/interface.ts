import { TGroupInfo, TGroupMemberInfo } from "./group";
import { TElements } from "./message";
import { TFriendInfo, TStrangerInfo } from "./user";

export type TAnonymous = {
  id: number;
  name: string;
  flag: string;
};

export type TStatus = { online: boolean; good: boolean };

type TLoginInfo = {
  user_id: number;
  nickname: string;
};

type TMessage = {
  time: number;
  message_type: string;
  message_id: number;
  real_id: number;
  sender: TStrangerInfo;
  message: TElements;
};

export interface IOnebotExports {
  ".handle_quick_operation"(params: { context: object; operation: object }): void;
  send_private_msg(params: { user_id: number; message: TElements; auto_escape?: boolean }): number;
  send_group_msg(params: { group_id: number; message: TElements; auto_escape?: boolean }): number;
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
  set_group_kick(params: { group_id: number; user_id: number; reject_add_request?: boolean }): void;
  set_group_ban(params: { group_id: number; user_id: number; duration?: number }): void;
  set_group_anonymous_ban(params: {
    group_id: number;
    anonymous?: TAnonymous;
    anonymous_flag?: string;
    duration?: number;
  }): void;
  set_group_whole_ban(params: { group_id: number; enable?: boolean }): void;
  set_group_admin(params: { group_id: number; user_id: number; enable?: boolean }): void;
  set_group_anonymous(params: { group_id: number; enable?: boolean }): void;
  set_group_card(params: { group_id: number; user_id: number; card?: string }): void;
  set_group_name(params: { group_id: number; group_name: string }): void;
  set_group_leave(params: { group_id: number; is_dismiss?: boolean }): void;
  set_group_special_title(params: {
    group_id: number;
    user_id: number;
    special_title?: string;
    duration?: number;
  }): void;
  set_friend_add_request(params: { flag: string; approve?: boolean; remark?: string }): void;
  set_group_add_request(params: { flag: string; sub_type: "add" | "invite"; approve?: boolean; reason?: string }): void;
  get_login_info(): TLoginInfo;
  get_stranger_info(params: { user_id: number; no_cache?: boolean }): TStrangerInfo;
  get_friend_list(): TFriendInfo[];
  get_group_info(params: { group_id: number; no_cache?: boolean }): TGroupInfo;
  get_group_list(): TGroupInfo[];
  get_group_member_info(params: { group_id: number; user_id: number; no_cache?: boolean }): TGroupMemberInfo;
  get_group_member_list(params: { group_id: number }): TGroupMemberInfo[];
  // 好麻烦，不实现。
  // get_group_honor_info(
  //   group_id: number,
  //   type: "talkative" | "performer" | "legend" | "strong_newbie" | "emotion" | "all",
  // ): GroupHonorInfoResponse;
  get_cookies(params: { domain?: string }): { cookies: string };
  get_csrf_token(): { token: number };
  get_credentials(params: { domain?: string }): { cookies: string; token: number };
  get_record(params: { file: string; out_format: string }): { file: string };
  get_image(params: { file: string }): { file: string };
  can_send_image(): { yes: boolean };
  can_send_record(): { yes: boolean };
  get_status(): TStatus;
  get_version_info(): { app_name: string; app_version: string; protocol_version: string };
  set_restart(params: { delay?: number }): void;
  clean_cache(): void;
}
