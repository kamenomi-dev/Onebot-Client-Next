"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const tslib_1 = require("tslib");
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const ws_1 = tslib_1.__importDefault(require("ws"));
const logger_1 = tslib_1.__importDefault(require("./logger"));
class BaseClient extends eventemitter3_1.default {
    bot_user_id;
    config;
    connection;
    logger;
    constructor(bot_user_id, config) {
        super();
        this.bot_user_id = bot_user_id;
        this.config = config;
        this.logger = logger_1.default.getLogger(`Client.${bot_user_id}`);
    }
    Connect() {
        return new Promise((resolve) => {
            this.connection = new ws_1.default(this.config.websocket_address, {
                headers: {
                    Authorization: `Bearer ${this.config.accent_token}`,
                },
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
    Disconnect() {
        if (this.connection) {
            this.connection.close();
            this.connection = undefined;
        }
    }
    CallApi(action, ...args) {
        if (!this.connection) {
            this.logger.warn("It sill tries to connect the target server. ");
            return new Promise(() => { });
        }
        const timestamp = new Date().getTime(); // _.uniqueId(`CallApi.${action}.`);
        const params = args.at(0) || {};
        return new Promise((resolve, reject) => {
            var messageHandler = (data) => {
                if (data.echo !== timestamp) {
                    return;
                }
                if (data.status === "ok") {
                    resolve(data.data);
                }
                else {
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
     * @param context
     * @param operation
     */
    QuickCallApi(context, operation) {
        return this.CallApi(".handle_quick_operation", {
            context,
            operation,
        });
    }
    QuickReply(from, context, auto_escape, at_sender, deleteMsg, operator_action) {
        if (from.message_type == "private") {
            return this.QuickCallApi(from, {
                reply: context,
                auto_escape,
            });
        }
        return this.QuickCallApi(from, {
            reply: context,
            auto_escape,
            at_sender,
            deleteMsg,
            ...operator_action,
        });
    }
    Send(data) {
        this.connection?.send(JSON.stringify(data));
    }
    __OpenHandler(event) {
        this.logger.debug(`Success to connect server ${this.config.websocket_address} with token ${this.config.accent_token}`);
        this.emit("open", event);
    }
    __MessageHandler(event) {
        this.logger.debug(`Message Received! ${event.data}`);
        let jsonData = JSON.parse(event.data.toString());
        this.emit("data", jsonData);
    }
    __ErrorHandler(event) {
        this.logger.error(`Native error! ${event}`);
        this.emit("error", event);
    }
    __CloseHandler(event) {
        this.logger.debug(`Success to disconnet from server ${this.config.websocket_address}`);
        this.emit("close", event);
    }
}
exports.BaseClient = BaseClient;
