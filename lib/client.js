"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const base_client_1 = require("./base_client");
class Client extends base_client_1.BaseClient {
    bot_user_id;
    config;
    friend_map = new Map();
    group_map = new Map();
    group_member_map = new Map();
    constructor(bot_user_id, config) {
        super(bot_user_id, config);
        this.bot_user_id = bot_user_id;
        this.config = config;
    }
    async Start() {
        await this.Connect();
        let friendList = await this.GetFriendList();
        for (const friendInfo of friendList) {
            this.friend_map.set(friendInfo.user_id, friendInfo);
        }
        let groupList = await this.GetGroupList();
        for (const groupInfo of groupList) {
            let memberMap = new Map();
            let memberList = await this.GetGroupMemberList(groupInfo.group_id);
            for (const memberInfo of memberList) {
                memberMap.set(memberInfo.user_id, memberInfo);
            }
            this.group_map.set(groupInfo.group_id, groupInfo);
            this.group_member_map.set(groupInfo.group_id, memberMap);
        }
        this.EventProcessorInit();
    }
    EventProcessorInit() {
        this.connection?.on("message", (rawData) => {
            const data = JSON.parse(rawData.toString());
            // Message
            if (data.post_type == "message") {
                let messageData = data;
                const eventName = ["message", messageData.message_type, messageData.sub_type].join(".");
                if (messageData.message_type == "private") {
                    const msgData = messageData;
                    let messageEvent = msgData;
                    messageEvent.reply = (message, auto_escape) => {
                        this.QuickReply(msgData, message, auto_escape);
                    };
                    this.emit(eventName, messageEvent);
                    return;
                }
                const msgData = messageData;
                let messageEvent = msgData;
                messageEvent.reply = (message, ...args) => {
                    this.QuickReply(messageEvent, message, ...args);
                };
                this.emit(eventName, messageEvent);
                return;
            }
            // Notice
            if (data.post_type == "notice") {
                let msgData = data;
                const eventName = ["notice", msgData.notice_type].join(".");
                this.emit(eventName, msgData);
                return;
            }
        });
    }
    /**
     * @debug
     * SetFriendAddRequest
     * @param flag 加好友请求的 flag（需从上报的数据中获得）
     * @param approve 是否同意请求，默认为 true
     * @param remark 添加后的好友备注（仅在同意时有效），默认为空
     */
    SetFriendAddRequest(flag, approve, remark) {
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
    SetGroupAddRequest(flag, sub_type, approve, reason) {
        this.CallApi("set_group_add_request", { flag, sub_type, approve, reason });
    }
    GetMsg(message_id) {
        return this.CallApi("get_msg", { message_id });
    }
    GetForwardMsg(id) {
        return this.CallApi("get_forward_msg", { id });
    }
    DeleteMsg(message_id) {
        return this.CallApi("delete_msg", { message_id });
    }
    GetStrangerInfo(user_id) {
        return this.CallApi("get_stranger_info", { user_id });
    }
    GetFriendList() {
        return this.CallApi("get_friend_list");
    }
    GetGroupList() {
        return this.CallApi("get_group_list");
    }
    GetGroupMemberList(group_id) {
        return this.CallApi("get_group_member_list", { group_id });
    }
    GetStatus() {
        return this.CallApi("get_status");
    }
    GetLoginInfo() {
        return this.CallApi("get_login_info");
    }
    GetVersionInfo() {
        return this.CallApi("get_version_info");
    }
    GetCookies(domain) {
        return this.CallApi("get_cookies", { domain });
    }
    GetCsrfToken() {
        return this.CallApi("get_csrf_token");
    }
    GetCredentails(domain) {
        return this.CallApi("get_credentials", { domain });
    }
    CanSendImage() {
        return this.CallApi("can_send_image");
    }
    CanSendRecord() {
        return this.CallApi("can_send_record");
    }
    SetRestart(delay) {
        return this.CallApi("set_restart", { delay });
    }
    CleanCache() {
        return this.CallApi("clean_cache");
    }
}
exports.Client = Client;
