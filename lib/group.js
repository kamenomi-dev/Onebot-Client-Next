"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = exports.Group = void 0;
const user_1 = require("./user");
class Group {
    client;
    group_id;
    memberMap = new Map();
    static As(client, group_id) {
        let groupInfo = client.group_map.get(group_id);
        if (!groupInfo) {
            throw new Error(`Can't find group ${group_id}`);
        }
        return new Group(client, group_id);
    }
    constructor(client, group_id) {
        this.client = client;
        this.group_id = group_id;
        let memberMap = this.client.group_member_map.get(group_id);
        if (memberMap) {
            [...memberMap.keys()].forEach((user_id) => {
                this.memberMap.set(user_id, Member.As(client, group_id, user_id));
            });
        }
    }
    get info() {
        return this.client.group_map.get(this.group_id);
    }
    set info(info) {
        this.client.group_map.set(this.group_id, info);
    }
    async GetInfo(cache = false) {
        if (cache) {
            return this.info;
        }
        this.info = await this.client.CallApi("get_group_info", { group_id: this.group_id, no_cache: true });
        return this.info;
    }
    PickMember(user_id) {
        return Member.As(this.client, this.group_id, user_id);
    }
    KickMember(user_id, reject_add_request) {
        return this.client.CallApi("set_group_kick", {
            group_id: this.group_id,
            user_id,
            reject_add_request,
        });
    }
    MuteMember(member_id, duration) {
        return this.client.CallApi("set_group_ban", {
            group_id: this.group_id,
            user_id: member_id,
            duration,
        });
    }
    MuteAnonymous(anonymous_flag, duration) {
        return this.client.CallApi("set_group_anonymous_ban", { group_id: this.group_id, anonymous_flag, duration });
    }
    MuteAll(enable) {
        return this.client.CallApi("set_group_whole_ban", { group_id: this.group_id, enable });
    }
    SetAdmin(member_id, enable) {
        return this.client.CallApi("set_group_admin", {
            group_id: this.group_id,
            user_id: member_id,
            enable,
        });
    }
    SetMemberCard(member_id, card) {
        return this.client.CallApi("set_group_card", { group_id: this.group_id, user_id: member_id, card });
    }
    SetName(group_name) {
        return this.client.CallApi("set_group_name", { group_id: this.group_id, group_name });
    }
    Quit(is_dismiss) {
        return this.client.CallApi("set_group_leave", { group_id: this.group_id, is_dismiss });
    }
    SetMemberTitle(member_id, title, duration) {
        return this.client.CallApi("set_group_special_title", {
            group_id: this.group_id,
            user_id: member_id,
            special_title: title,
            duration,
        });
    }
    SendMsg(message, auto_escape) {
        return this.client.CallApi("send_group_msg", { group_id: this.group_id, message, auto_escape });
    }
}
exports.Group = Group;
// @ts-expect-error
class Member extends user_1.User {
    group_id;
    user_id;
    group;
    info;
    static As(client, group_id, user_id) {
        let memberInfo = client.group_member_map.get(group_id)?.get(user_id);
        if (!memberInfo) {
            throw new Error(`Cant find member ${user_id} in group ${group_id}`);
        }
        return new Member(client, group_id, user_id);
    }
    constructor(client, group_id, user_id) {
        super(client, user_id);
        this.group_id = group_id;
        this.user_id = user_id;
        this.info = client.group_member_map.get(group_id)?.get(user_id);
        this.group = Group.As(client, group_id);
    }
    Kick(reject_add_request) {
        return this.group.KickMember(this.user_id, reject_add_request);
    }
    Mute(duration) {
        return this.group.MuteMember(this.user_id, duration);
    }
    SsetAdmin(enable) {
        return this.group.SetAdmin(this.user_id, enable);
    }
    SetCard(card) {
        return this.group.SetMemberCard(this.user_id, card);
    }
    SetTitle(title, duration) {
        return this.group.SetMemberTitle(this.user_id, title, duration);
    }
}
exports.Member = Member;
