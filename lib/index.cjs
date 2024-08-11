"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } var _class; var _class2;// src/logger.ts
var ELoggerLevel = /* @__PURE__ */ ((ELoggerLevel3) => {
  ELoggerLevel3[ELoggerLevel3["debug"] = 0] = "debug";
  ELoggerLevel3[ELoggerLevel3["trace"] = 1] = "trace";
  ELoggerLevel3[ELoggerLevel3["info"] = 2] = "info";
  ELoggerLevel3[ELoggerLevel3["warn"] = 3] = "warn";
  ELoggerLevel3[ELoggerLevel3["error"] = 4] = "error";
  return ELoggerLevel3;
})(ELoggerLevel || {});
var ClientLogger = class {
  constructor(logLevel = 0 /* debug */) {
    this.logLevel = logLevel;
    this.logger = console;
  }
  
  debug(message, ...optionalParams) {
    if (0 /* debug */ >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }
  trace(message, ...optionalParams) {
    if (1 /* trace */ >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }
  info(message, ...optionalParams) {
    if (2 /* info */ >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }
  warn(message, ...optionalParams) {
    if (3 /* warn */ >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }
  error(message, ...optionalParams) {
    if (4 /* error */ >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }
};

// src/message.ts
var Segment;
((Segment2) => {
  Segment2.segment = {
    /** @deprecated 文本，建议直接使用字符串 */
    Text(text) {
      return {
        type: "text",
        data: {
          text
        }
      };
    },
    Face(id) {
      return {
        type: "face",
        data: {
          id
        }
      };
    },
    /** 猜拳(id=1~3) */
    Rps() {
      return {
        type: "rps",
        data: {}
      };
    },
    /** 骰子(id=1~6) */
    Dice() {
      return {
        type: "dice",
        data: {}
      };
    },
    /** mention@提及
     * @param qq 全体成员为 all
     */
    At(qq, text, dummy) {
      return {
        type: "at",
        data: {
          qq,
          text,
          dummy
        }
      };
    },
    /** 图片(支持http://,base64://) */
    Image(file, cache, proxy, timeout) {
      return {
        type: "image",
        data: {
          file,
          cache: cache != void 0 ? cache ? 1 : 0 : void 0,
          proxy: proxy != void 0 ? proxy ? 1 : 0 : void 0,
          timeout
        }
      };
    },
    /** 闪照(支持http://,base64://) */
    Flash(file, cache, proxy, timeout) {
      return {
        type: "image",
        data: {
          type: "flash",
          file,
          cache: cache != void 0 ? cache ? 1 : 0 : void 0,
          proxy: proxy != void 0 ? proxy ? 1 : 0 : void 0,
          timeout
        }
      };
    },
    /** 语音(支持http://,base64://) */
    Record(file) {
      return {
        type: "record",
        data: {
          file: file.toString()
        }
      };
    },
    /** 视频(仅支持本地文件) */
    Video(file) {
      return {
        type: "video",
        data: {
          file
        }
      };
    },
    Json(data) {
      return {
        type: "json",
        data: { data: JSON.stringify(data) }
      };
    },
    Xml(data, id) {
      return {
        type: "xml",
        data: {
          data,
          id
        }
      };
    },
    /** 链接分享 */
    Share(url, title, image, content) {
      return {
        type: "share",
        data: {
          url,
          title,
          image,
          content
        }
      };
    },
    /** 位置分享 */
    Location(lat, lng, address, id) {
      return {
        type: "location",
        data: {
          lat: String(lat),
          lon: String(lng),
          address,
          id
        }
      };
    },
    /** id 0~6 */
    Poke(id, type) {
      return {
        type: "poke",
        data: {
          id,
          type
        }
      };
    },
    /** @deprecated 将CQ码转换为消息链 */
    FromCqcode(strData) {
      const resultElements = [];
      const matchedTokens = strData.matchAll(/\[CQ:[^\]]+\]/g);
      let prevIdx = 0;
      for (let token of matchedTokens) {
        const text = strData.slice(prevIdx, token.index).replace(/&#91;|&#93;|&amp;/g, UnescapeCQ);
        if (text) {
          resultElements.push({ type: "text", data: { text } });
        }
        const element = token[0];
        let cq = element.replace("[CQ:", "type=");
        cq = cq.substr(0, cq.length - 1);
        resultElements.push(Qs(cq));
        prevIdx = token.index + element.length;
      }
      if (prevIdx < strData.length) {
        const text = strData.slice(prevIdx).replace(/&#91;|&#93;|&amp;/g, UnescapeCQ);
        if (text) {
          resultElements.push({ type: "text", data: { text } });
        }
      }
      return resultElements;
    }
  };
  function UnescapeCQ(s) {
    if (s === "&#91;") return "[";
    if (s === "&#93;") return "]";
    if (s === "&amp;") return "&";
    return "";
  }
  Segment2.UnescapeCQ = UnescapeCQ;
  function UnescapeCQInside(s) {
    if (s === "&#44;") return ",";
    if (s === "&#91;") return "[";
    if (s === "&#93;") return "]";
    if (s === "&amp;") return "&";
    return "";
  }
  Segment2.UnescapeCQInside = UnescapeCQInside;
  function Qs(s, sep = ",", equal = "=") {
    const ret = {};
    const split = s.split(sep);
    for (let v of split) {
      const i = v.indexOf(equal);
      if (i === -1) continue;
      ret[v.substring(0, i)] = v.substr(i + 1).replace(/&#44;|&#91;|&#93;|&amp;/g, UnescapeCQInside);
    }
    for (let k in ret) {
      try {
        if (k !== "text") ret[k] = JSON.parse(ret[k]);
      } catch (e) {
      }
    }
    return ret;
  }
  Segment2.Qs = Qs;
})(Segment || (Segment = exports.Segment = {}));

// src/user.ts
var User = class _User {
  constructor(client, user_id) {
    this.client = client;
    this.user_id = user_id;
  }
  static As(user_id) {
    return new _User(this, Number(user_id));
  }
  AsStrangerInfo(user_id) {
    return this.client.GetStrangerInfo(user_id);
  }
  AsFriend() {
    return Friend.As(this.client, this.user_id);
  }
  AsMember(group_id) {
    return Member.As(this.client, group_id, this.user_id);
  }
  /**
   * SendLike 点赞
   * @param times 点赞次数，最多为 10，默认为 1 。
   */
  SendLike(times) {
    return this.client.CallApi("send_like", { user_id: this.user_id, times });
  }
  /**
   * SendMessage (send_private_msg) 发送私聊消息
   * @param message 要发送的内容。
   */
  SendMessage(message, auto_escape = false) {
    return this.client.CallApi("send_private_msg", {
      user_id: this.user_id,
      message,
      auto_escape
    });
  }
  /**
   * SendForwardMessage (send_private_forward_msg) 发送私聊合并转发消息
   * @param messages 要发送的合并转发内容。
   */
  SendForwardMessage(messages) {
    return this.client.CallApi("send_private_forward_msg", {
      user_id: this.user_id,
      messages
    });
  }
};
var Friend = class _Friend extends User {
  
  constructor(client, user_id) {
    super(client, user_id);
    this.info = client.friend_map.get(this.user_id);
  }
  static As(client, uid) {
    const friendInfo = client.friend_map.get(uid);
    if (!friendInfo) {
      throw new Error("Can't find friend: " + uid);
    }
    return new _Friend(client, uid);
  }
};

// src/group.ts
var groupCache = /* @__PURE__ */ new Map();
var Group = (_class = class _Group {
  constructor(client, group_id) {;_class.prototype.__init.call(this);
    this.client = client;
    this.group_id = group_id;
    groupCache.set(group_id, this);
    let memberMap = this.client.group_member_map.get(group_id);
    if (memberMap) {
      [...memberMap.keys()].forEach((user_id) => {
        this.member_map.set(user_id, Member.As(client, group_id, user_id));
      });
    }
  }
  __init() {this.member_map = /* @__PURE__ */ new Map()}
  static As(client, group_id) {
    let groupInfo = client.group_map.get(group_id);
    if (!groupInfo) {
      throw new Error(`Can't find group ${group_id}`);
    }
    let group = groupCache.get(group_id);
    if (typeof group != "undefined") {
      return group;
    }
    return new _Group(client, group_id);
  }
  get info() {
    return this.client.group_map.get(this.group_id);
  }
  set info(info) {
    this.client.group_map.set(this.group_id, info);
  }
  /**
   * GetInfo (get_group_info) 获取群信息
   * @param cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快），默认为 false。
   */
  async GetInfo(cache = false) {
    if (cache) {
      return this.info;
    }
    this.info = await this.client.CallApi("get_group_info", {
      group_id: this.group_id,
      no_cache: true
    });
    return this.info;
  }
  /**
   * GetIgnoreAddRequest (get_group_ignore_add_request) 获取已过滤的加群通知
   */
  GetIgnoreAddRequest() {
    return this.client.CallApi("get_group_ignore_add_request");
  }
  /**
   * UploadFile (upload_group_file) 上传群文件
   * @param file 本地文件绝对路径
   * @param name 存储名称
   * @param folder 父目录ID
   */
  UploadFile(file, name, folder) {
    return this.client.CallApi("upload_group_file", {
      group_id: this.group_id,
      file,
      name,
      folder
    });
  }
  /**
   * GetHonorMembers (get_group_honor_info) 获取群荣誉信息
   * @param type 要获取的群荣誉类型，可传入 talkative performer legend strong_newbie emotion 以分别获取单个类型的群荣誉数据，或传入 all 获取所有数据。
   */
  GetHonorMembers(type) {
    return this.client.CallApi("get_group_honor_info", {
      group_id: this.group_id,
      type
    });
  }
  PickMember(user_id) {
    return Member.As(this.client, this.group_id, user_id);
  }
  /**
   * KickMember (set_group_kick) 群组踢人
   * @param user_id 要踢的 QQ 号
   * @param reject_add_request 拒绝此人的加群请求，默认为 false
   */
  KickMember(user_id, reject_add_request = false) {
    return this.client.CallApi("set_group_kick", {
      group_id: this.group_id,
      user_id,
      reject_add_request
    });
  }
  /**
   * MuteMember (set_group_ban) 群组单人禁言
   * @param user_id 要禁言的 QQ 号
   * @param duration 禁言时长，单位秒，0 表示取消禁言，默认为 30*60 秒（30 分钟）。
   */
  MuteMember(user_id, duration = 1800) {
    return this.client.CallApi("set_group_ban", {
      group_id: this.group_id,
      user_id,
      duration
    });
  }
  /**
   * MuteAnonymous (set_group_anonymous_ban) 群组匿名用户禁言
   * @param anonymous 要禁言的匿名用户对象（群消息上报的 anonymous 字段），可选。
   * @param anonymous_flag 要禁言的匿名用户的 flag（需从群消息上报的数据中获得），可选。
   * @param duration 禁言时长，单位秒，无法取消匿名用户禁言，默认为 30*60 秒（30分钟）。
   */
  MuteAnonymous(anonymous, anonymous_flag, duration) {
    return this.client.CallApi("set_group_anonymous_ban", {
      group_id: this.group_id,
      anonymous,
      anonymous_flag,
      duration
    });
  }
  /**
   * MuteAll (set_group_whole_ban) 群组全员禁言
   * @param enable 是否禁言，默认为 true。
   */
  MuteAll(enable = true) {
    return this.client.CallApi("set_group_whole_ban", {
      group_id: this.group_id,
      enable
    });
  }
  /**
   * SetAdmin (set_group_anonymous) 群组匿名
   * @param user_id 要设置管理员的 QQ 号。
   * @param enable true 为设置，false 为取消，默认为 true。
   * @returns
   */
  SetAdmin(user_id, enable = true) {
    return this.client.CallApi("set_group_admin", {
      group_id: this.group_id,
      user_id,
      enable
    });
  }
  /**
   * SetMemberCard (set_group_card) 设置群名片（群备注）
   * @param user_id 要设置的 QQ 号。
   * @param card 群名片内容，不填或空字符串表示删除群名片，默认为 空。
   */
  SetMemberCard(user_id, card) {
    return this.client.CallApi("set_group_card", {
      group_id: this.group_id,
      user_id,
      card
    });
  }
  /**
   * SetName (set_group_name) 设置群名
   * @param group_name 新群名。
   */
  SetName(group_name) {
    return this.client.CallApi("set_group_name", {
      group_id: this.group_id,
      group_name
    });
  }
  /**
   * Quit (set_group_leave) 退出群组
   * @param is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散，默认为 false。
   */
  Quit(is_dismiss = false) {
    return this.client.CallApi("set_group_leave", {
      group_id: this.group_id,
      is_dismiss
    });
  }
  /**
   * SetMemberTitle (set_group_special_title) 设置群组专属头衔
   * @param user_id 要设置的 QQ 号。
   * @param special_title 专属头衔，不填或空字符串表示删除专属头衔，可选。
   * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试，默认为 -1。
   */
  SetMemberTitle(user_id, special_title, duration = -1) {
    return this.client.CallApi("set_group_special_title", {
      group_id: this.group_id,
      user_id,
      special_title,
      duration
    });
  }
  /**
   * SendMsg (send_group_msg) 发送群消息
   * @param message 要发送的内容。
   * @param auto_escape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效，默认为 false。
   */
  SendMessage(message, auto_escape = false) {
    return this.client.CallApi("send_group_msg", {
      group_id: this.group_id,
      message,
      auto_escape
    });
  }
  SendForwardMessage(messages) {
    return this.client.CallApi("send_group_forward_msg", {
      group_id: this.group_id,
      messages
    });
  }
  /**
   * GetMessageHistory (get_group_msg_history) 获取群历史消息
   * @param message_seq 获取从seq以上的消息，默认为 空，即获取最新消息。
   * @returns 获取消息类型数组，最大数组长度为 19 。
   */
  GetMessageHistory(message_seq) {
    return this.client.CallApi("get_group_msg_history", {
      message_seq,
      group_id: this.group_id
    });
  }
}, _class);
var Member = class _Member extends User {
  constructor(client, group_id, user_id) {
    super(client, user_id);
    this.group_id = group_id;
    this.user_id = user_id;
    this.info = _optionalChain([client, 'access', _ => _.group_member_map, 'access', _2 => _2.get, 'call', _3 => _3(group_id), 'optionalAccess', _4 => _4.get, 'call', _5 => _5(user_id)]);
    this.group = Group.As(client, group_id);
  }
  
  
  static As(client, group_id, user_id) {
    let memberInfo = _optionalChain([client, 'access', _6 => _6.group_member_map, 'access', _7 => _7.get, 'call', _8 => _8(group_id), 'optionalAccess', _9 => _9.get, 'call', _10 => _10(user_id)]);
    if (!memberInfo) {
      throw new Error(`Cant find member ${user_id} in group ${group_id}`);
    }
    return new _Member(client, group_id, user_id);
  }
  /**
   * Kick 群组踢人
   * @param reject_add_request 拒绝此人的加群请求，默认为 false。
   */
  Kick(reject_add_request) {
    return this.group.KickMember(this.user_id, reject_add_request);
  }
  /**
   * Mute 群组单人禁言
   * @param duration 禁言时长，单位秒，默认为 30*60 秒，(30 分钟)。
   */
  Mute(duration = 1800) {
    return this.group.MuteMember(this.user_id, duration);
  }
  /**
   * SetAdmin 群组设置管理员
   * @param enable true 为设置，false 为取消，默认为 true。
   */
  SetAdmin(enable = true) {
    return this.group.SetAdmin(this.user_id, enable);
  }
  /**
   * SetCard 设置群名片（群备注）
   * @param card 群名片内容，不填或空字符串表示删除群名片，默认为 空。
   */
  SetCard(card) {
    return this.group.SetMemberCard(this.user_id, card);
  }
  /**
   * SetSpecialTitle 设置群组专属头衔
   * @param special_title 专属头衔，不填或空字符串表示删除专属头衔，默认为 空。
   * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试，默认为 -1。
   */
  SetSpecialTitle(special_title, duration = -1) {
    return this.group.SetMemberTitle(this.user_id, special_title, duration);
  }
};

// src/base_client.ts
var _ws = require('ws'); var _ws2 = _interopRequireDefault(_ws);
var _eventemitter3 = require('eventemitter3');
var BaseClient = class extends _eventemitter3.EventEmitter {
  constructor(bot_user_id, config) {
    super();
    this.bot_user_id = bot_user_id;
    this.config = config;
    this.logger = new ClientLogger(_optionalChain([config, 'access', _11 => _11.options, 'optionalAccess', _12 => _12.log_level]));
  }
  
  
  /**
   * Connect to Websocket Server
   * @async
   */
  Connect() {
    return new Promise((resolve) => {
      this.connection = new (0, _ws2.default)(this.config.websocket_address, {
        headers: {
          Authorization: `Bearer ${this.config.accent_token}`
        }
      });
      this.connection.onopen = (event) => {
        this.__OpenHandler(event);
        resolve();
      };
      this.connection.onmessage = this.__MessageHandler.bind(this);
      this.connection.onerror = this.__ErrorHandler.bind(this);
      this.connection.onclose = this.__CloseHandler.bind(this);
    });
  }
  /**
   * Disconnect to the Websocket Server
   */
  Disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = void 0;
    }
  }
  /**
   * CallApi
   * @param action api
   * @param args arguments of api
   */
  CallApi(action, ...args) {
    if (!this.connection) {
      this.logger.warn("It sill tries to connect the target server. ");
      return new Promise(() => {
      });
    }
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    const params = args.at(0) || {};
    return new Promise((resolve, reject) => {
      var messageHandler = (data) => {
        if (data.echo !== timestamp) {
          return;
        }
        if (data.status === "ok") {
          resolve(data.data);
        } else {
          reject(data.error);
        }
        this.off("data", messageHandler);
      };
      this.on("data", messageHandler);
      this.Send({ action, params, echo: timestamp });
    });
  }
  /**
   * @ignore Internal methods
   */
  QuickCallApi(context, operation) {
    return this.CallApi(".handle_quick_operation", {
      context,
      operation
    });
  }
  /**
   * @ignore Internal methods, common message operation
   */
  QuickReply(from, context, auto_escape, at_sender) {
    return this.QuickCallApi(from, {
      reply: context,
      auto_escape,
      at_sender
    });
  }
  /**
   * @ignore Internal methods, common message operation
   */
  QuickRecall(from) {
    return this.QuickCallApi(from, {
      delete: true
    });
  }
  /**
   * @ignore Internal methods, common group message operation
   */
  QuickKick(from) {
    return this.QuickCallApi(from, {
      kick: true
    });
  }
  /**
   * @ignore Internal methods, common group message operation
   */
  QuickMute(from, ban_duration) {
    return this.QuickCallApi(from, {
      ban: true,
      ban_duration
    });
  }
  /**
   * @ignore Internal methods, friend add request operation
   */
  QuickFriendApprove(from, isApprove = true, remark) {
    return this.QuickCallApi(from, {
      approve: isApprove,
      remark
    });
  }
  /**
   * @ignore Internal methods, group add or request request operation
   */
  QuickGroupAddOrInviteApprove(from, isApprove = true, reason) {
    return this.QuickCallApi(from, {
      approve: isApprove,
      reason
    });
  }
  Send(data) {
    _optionalChain([this, 'access', _13 => _13.connection, 'optionalAccess', _14 => _14.send, 'call', _15 => _15(JSON.stringify(data))]);
  }
  __OpenHandler(event) {
    this.logger.debug(
      `Success to connect server ${this.config.websocket_address} with token ${this.config.accent_token}`
    );
    this.emit("open", event);
  }
  __MessageHandler(event) {
    let data = JSON.parse(event.data.toString());
    if (data["status"] == "failed") {
      this.emit("error", data);
      return;
    }
    this.logger.debug(`Message Received! ${event.data.toString()}`);
    this.emit("data", data);
  }
  __ErrorHandler(event) {
    this.logger.error(`Native error! ${event["message"]}`);
    this.emit("error", event);
    this.Disconnect();
  }
  __CloseHandler(event) {
    this.logger.debug(
      `Success to disconnet from server ${this.config.websocket_address}`
    );
    this.emit("close", event);
  }
};

// src/client.ts
var Client = (_class2 = class extends BaseClient {
  constructor(bot_user_id, config) {
    super(bot_user_id, config);_class2.prototype.__init2.call(this);_class2.prototype.__init3.call(this);_class2.prototype.__init4.call(this);;
    this.bot_user_id = bot_user_id;
    this.config = config;
    if (_optionalChain([config, 'access', _16 => _16.options, 'optionalAccess', _17 => _17.skip_logo])) {
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
  __init2() {this.friend_map = /* @__PURE__ */ new Map()}
  __init3() {this.group_map = /* @__PURE__ */ new Map()}
  __init4() {this.group_member_map = /* @__PURE__ */ new Map()}
  /**
   * Connect to websocket server.
   * @async
   */
  async Start() {
    let connectHandler = (err) => {
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
    let friendList = await this.GetFriendList();
    for (const friendInfo of friendList) {
      this.friend_map.set(friendInfo.user_id, friendInfo);
    }
    let groupList = await this.GetGroupList();
    for (const groupInfo of groupList) {
      let memberMap = /* @__PURE__ */ new Map();
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
    this.InitEventListener();
    this.logger.info(`All event listener was registered. `);
    return this;
  }
  /**
   * Disconnect to the websocket server.
   */
  Stop() {
    this.Disconnect();
  }
  InitEventListener() {
    _optionalChain([this, 'access', _18 => _18.connection, 'optionalAccess', _19 => _19.on, 'call', _20 => _20("message", (rawData) => {
      const data = JSON.parse(rawData.toString());
      if (data.post_type == "message") {
        const messageData = data;
        const { message_id, message_type, sub_type } = messageData;
        const eventName = ["message", message_type, sub_type].filter(Boolean).join(".");
        messageData.reply = (message, ...args) => {
          this.QuickReply(messageData, message, ...args);
        };
        messageData.replyViaEmoji = (emoji_id) => {
          this.CallApi("send_msg_emoji_like", { message_id, emoji_id });
        };
        messageData.forwardMessage = (target_id) => {
          return this.CallApi(
            message_type == "private" ? "forward_friend_single_msg" : "forward_group_single_msg",
            {
              user_id: target_id,
              message_id
            }
          );
        };
        if (message_type == "private") {
          this.EmitEvent(eventName, messageData);
          return;
        }
        let messageEvent = messageData;
        messageEvent.reply = (message, ...args) => {
          this.QuickReply(messageEvent, message, ...args);
        };
        messageEvent.recall = () => {
          this.QuickRecall(messageEvent);
        };
        messageEvent.kick = () => {
          this.QuickKick(messageEvent);
        };
        messageEvent.mute = (time) => {
          this.QuickMute(messageEvent, time);
        };
        this.EmitEvent(eventName, messageEvent);
        return;
      }
      if (data.post_type == "notice") {
        const messageData = data;
        const eventName = ["notice", messageData.notice_type].filter(Boolean).join(".");
        this.EmitEvent(eventName, messageData);
        return;
      }
      if (data.post_type == "request") {
        const messageData = data;
        const eventName = [
          "request",
          messageData.request_type,
          messageData["sub_type"]
          // If request data comes from group.
        ].filter(Boolean).join(".");
        if (messageData.request_type == "friend") {
          let messageEvent2 = data;
          messageEvent2.approve = (isApprove, remark) => {
            this.QuickFriendApprove(messageEvent2, isApprove, remark);
          };
          this.EmitEvent(eventName, messageData);
          return;
        }
        let messageEvent = data;
        messageEvent.approve = (isApprove, reason) => {
          this.QuickGroupAddOrInviteApprove(messageEvent, isApprove, reason);
        };
        this.EmitEvent(eventName, messageData);
        return;
      }
      if (data.post_type == "meta_event") {
        const messageData = data;
        const eventName = ["meta_event", messageData.meta_event_type].filter(Boolean).join(".");
        this.EmitEvent(eventName, messageData);
      }
    })]);
  }
  EmitEvent(eventName, data, isBubble) {
    if (!isBubble) {
      this.emit(eventName, data);
      return;
    }
    let eventBlock = eventName.split(".");
    for (let _event of eventBlock) {
      this.emit(eventBlock.join("."), data);
      eventBlock.pop();
    }
  }
  /**
   * GetFriendsWithCategory 获取附有分组信息的好友列表
   */
  GetFriendsWithCategory() {
    return this.CallApi("get_friends_with_category");
  }
  /**
   * SetAvatar (set_qq_avatar) 设置群头像
   * @param file 支持URI格式的绝对路径、网络 URL 以及 Base64 编码。
   */
  SetAvatar(file) {
    this.CallApi("set_qq_avatar", { file });
  }
  /**
   * GetFile (get_file) 下载群/私聊文件
   * @param file_id 文件ID。
   */
  GetFile(file_id) {
    return this.CallApi("get_file", { file_id });
  }
  /**
   * DownloadFile (download_file) 下载文件
   */
  DownloadFile(url, thread_count, headers, base64) {
    return this.CallApi("download_file", {
      url,
      thread_count,
      headers,
      base64
    });
  }
  /**
   * SetFriendAddRequest 处理好友添加请求
   * @param flag 加好友请求的 flag（需从上报的数据中获得）。
   * @param approve 是否同意请求，默认为 true。
   * @param remark 添加后的好友备注（仅在同意时有效），默认为空。
   */
  SetFriendAddRequest(flag, approve, remark) {
    this.CallApi("set_friend_add_request", { flag, approve, remark });
  }
  /**
   * SetGroupAddRequest 处理群聊成员添加请求
   * @param flag 加群请求的 flag（需从上报的数据中获得）。
   * @param sub_type add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）。
   * @param approve 是否同意请求／邀请，默认为 true。
   * @param reason 拒绝理由（仅在拒绝时有效），默认为空。
   */
  SetGroupAddRequest(flag, sub_type, approve, reason) {
    this.CallApi("set_group_add_request", { flag, sub_type, approve, reason });
  }
  /**
   * @deprecated
   * SendMessageEmojiLike (send_msg_emoji_like)
   * @param message_id 消息ID。
   * @param emoji_id 表情ID，取值范围为 [+4, +128563]。
   */
  SendMessageEmojiLike(message_id, emoji_id) {
    this.CallApi("send_msg_emoji_like", { message_id, emoji_id });
  }
  /**
   * GetMsg 获取消息
   * @param message_id 消息ID。
   */
  GetMsg(message_id) {
    return this.CallApi("get_msg", { message_id });
  }
  /**
   * GetForwardMsg 获取合并转发消息
   * @param id 合并转发 ID。
   */
  GetForwardMsg(id) {
    return this.CallApi("get_forward_msg", { id });
  }
  /**
   * DeleteMsg 撤回消息
   * @param message_id 消息 ID。
   */
  DeleteMsg(message_id) {
    return this.CallApi("delete_msg", { message_id });
  }
  /**
   * GetStrangerInfo 获取陌生人信息
   * @param user_id QQ 号。
   */
  GetStrangerInfo(user_id) {
    return this.CallApi("get_stranger_info", { user_id });
  }
  /**
   * GetFriendList 获取好友列表
   */
  GetFriendList() {
    return this.CallApi("get_friend_list");
  }
  /**
   * GetGroupList 获取群聊列表
   */
  GetGroupList() {
    return this.CallApi("get_group_list");
  }
  /**
   * GetGroupMemberList 获取群成员列表
   * @param group_id 群号。
   */
  GetGroupMemberList(group_id) {
    return this.CallApi("get_group_member_list", { group_id });
  }
  /**
   * GetStatus 获取运行状态
   */
  GetStatus() {
    return this.CallApi("get_status");
  }
  /**
   * GetLoginInfo 获取登录号信息
   */
  GetLoginInfo() {
    return this.CallApi("get_login_info");
  }
  /**
   * GetVersionInfo 获取版本信息
   * @returns 本接口仅提供最基础的属性，其他属性见所使用的 Bot 框架文档。
   */
  GetVersionInfo() {
    return this.CallApi("get_version_info");
  }
  /**
   * GetCookies 获取Cookies
   * @param domain 需要获取 cookies 的域名，默认为空。
   */
  GetCookies(domain) {
    return this.CallApi("get_cookies", { domain });
  }
  /**
   * GetCsrfToken 获取 CSRF Token
   */
  GetCsrfToken() {
    return this.CallApi("get_csrf_token");
  }
  /**
   * GetCredentials 获取 QQ 相关接口凭证
   * @param domain 需要获取 cookies 的域名，默认为空。
   */
  GetCredentails(domain) {
    return this.CallApi("get_credentials", { domain });
  }
  /**
   * CanSendImage 检查是否可以发送图片
   */
  CanSendImage() {
    return this.CallApi("can_send_image");
  }
  /**
   * CanSendRecord 检查是否可以发送语音
   */
  CanSendRecord() {
    return this.CallApi("can_send_record");
  }
  /**
   * SetRestart 重启 OneBot 实现
   * @param delay 要延迟的毫秒数，如果默认情况下无法重启，可以尝试设置延迟为 2000 左右，默认为 0。
   * @description 由于重启 OneBot 实现同时需要重启 API 服务，这意味着当前的 API 请求会被中断，因此需要异步地重启，接口返回的 status 是 async。
   */
  SetRestart(delay) {
    return this.CallApi("set_restart", { delay });
  }
  /**
   * CleanCache 清理缓存
   * @description 用于清理积攒了太多的缓存文件。
   */
  CleanCache() {
    return this.CallApi("clean_cache");
  }
}, _class2);










exports.BaseClient = BaseClient; exports.Client = Client; exports.ClientLogger = ClientLogger; exports.ELoggerLevel = ELoggerLevel; exports.Friend = Friend; exports.Group = Group; exports.Member = Member; exports.Segment = Segment; exports.User = User;
