"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friend = exports.User = void 0;
const group_1 = require("./group");
class User {
    client;
    user_id;
    constructor(client, user_id) {
        this.client = client;
        this.user_id = user_id;
    }
    static As(user_id) {
        return new User(this, Number(user_id));
    }
    AsStrangerInfo(user_id) {
        return this.client.GetStrangerInfo(user_id);
    }
    AsFriend() {
        return Friend.As(this.client, this.user_id);
    }
    AsMember(group_id) {
        return group_1.Member.As(this.client, group_id, this.user_id);
    }
    SendLike(times) {
        return this.client.CallApi("send_like", { user_id: this.user_id, times });
    }
}
exports.User = User;
class Friend {
    client;
    user_id;
    info;
    constructor(client, user_id) {
        this.client = client;
        this.user_id = user_id;
        this.info = client.friend_map.get(this.user_id);
    }
    static As(client, uid) {
        const friendInfo = client.friend_map.get(uid);
        if (!friendInfo) {
            throw new Error("Can't find friend: " + uid);
        }
        return new Friend(client, uid);
    }
    SendMsg(message) {
        return this.client.CallApi("send_private_msg", { user_id: this.user_id, message });
    }
}
exports.Friend = Friend;
