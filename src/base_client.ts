import { OnebotClient } from "./event.js";
import { IOnebotExports, TApiCallback } from "./interface.js";
import { MessageEvent, RequestEvent, TElements } from "./message.js";

import WebSocket from "ws";
import { EventEmitter } from "eventemitter3";
import { ClientLogger, ELoggerLevel } from "./logger.ts";

export type TBaseClientEventMap = {
  "data"(data: TApiCallback): void;
  "open"(event: WebSocket.Event): void;
  "error"(event: WebSocket.ErrorEvent): void;
  "close"(event: WebSocket.CloseEvent): void;

  "system.connect"(): void;
  "system.disconnect"(): void;
};

export type TClientConfig = {
  websocket_address: string;
  accent_token?: string;
  options?: {
    skip_logo?: boolean;
    log_level?: ELoggerLevel;
  };
};

export class BaseClient extends EventEmitter<
  OnebotClient.EventMap & TBaseClientEventMap
> {
  public connection?: WebSocket;
  public logger: ClientLogger;

  public constructor(
    public readonly bot_user_id: number,
    public readonly config: TClientConfig
  ) {
    super();

    this.logger = new ClientLogger(config.options?.log_level);
  }

  /**
   * Connect to Websocket Server
   * @async
   */
  public Connect() {
    return new Promise<void>((resolve) => {
      this.connection = new WebSocket(this.config.websocket_address, {
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

  /**
   * Disconnect to the Websocket Server
   */
  public Disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = undefined;
    }
  }

  /**
   * CallApi
   * @param action api
   * @param args arguments of api
   */
  public CallApi<T extends keyof IOnebotExports, R extends IOnebotExports[T]>(
    action: T,
    ...args: Parameters<R>
  ): Promise<ReturnType<R>> {
    if (!this.connection) {
      this.logger.warn("It sill tries to connect the target server. ");
      return new Promise<any>(() => {});
    }

    const timestamp = new Date().getTime(); // _.uniqueId(`CallApi.${action}.`);
    const params = args.at(0) || {};

    return new Promise<any>((resolve, reject) => {
      var messageHandler = (data: TApiCallback) => {
        if (data.echo !== timestamp) {
          return;
        }

        if (data.status === "ok") {
          resolve(data.data);
        } else {
          reject(data);
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
  public QuickCallApi(context: object, operation: object) {
    return this.CallApi(".handle_quick_operation", {
      context,
      operation,
    });
  }

  /**
   * @ignore Internal methods, common message operation
   */
  public QuickReply(
    from: MessageEvent.TMessageEvent,
    context: TElements,
    auto_escape?: boolean,
    at_sender?: boolean
  ) {
    return this.QuickCallApi(from, {
      reply: context,
      auto_escape,
      at_sender,
    });
  }

  /**
   * @ignore Internal methods, common message operation
   */
  public QuickRecall(from: MessageEvent.TGroupMessageEvent) {
    return this.QuickCallApi(from, {
      delete: true,
    });
  }

  /**
   * @ignore Internal methods, common group message operation
   */
  public QuickKick(from: MessageEvent.TGroupMessageEvent) {
    return this.QuickCallApi(from, {
      kick: true,
    });
  }

  /**
   * @ignore Internal methods, common group message operation
   */
  public QuickMute(
    from: MessageEvent.TGroupMessageEvent,
    ban_duration?: number
  ) {
    return this.QuickCallApi(from, {
      ban: true,
      ban_duration,
    });
  }

  /**
   * @ignore Internal methods, friend add request operation
   */
  public QuickFriendApprove(
    from: RequestEvent.TFriendAddInviteEvent,
    isApprove: boolean = true,
    remark?: string
  ) {
    return this.QuickCallApi(from, {
      approve: isApprove,
      remark,
    });
  }

  /**
   * @ignore Internal methods, group add or request request operation
   */
  public QuickGroupAddOrInviteApprove(
    from: RequestEvent.TMemberAddOrInviteEvent,
    isApprove: boolean = true,
    reason?: string
  ) {
    return this.QuickCallApi(from, {
      approve: isApprove,
      reason,
    });
  }

  public Send(data: Record<string, any>) {
    this.connection?.send(JSON.stringify(data));
  }

  private __OpenHandler(event: WebSocket.Event) {
    this.logger.info(
      `Success to connect server ${this.config.websocket_address} with token ${this.config.accent_token}`
    );

    this.emit("open", event);
  }

  private __MessageHandler(event: WebSocket.MessageEvent) {
    let data = JSON.parse(event.data.toString());

    if (data["status"] == "failed") {
      this.emit("error", data);
    }

    this.logger.debug(`Message Received! ${event.data.toString()}`);
    this.emit("data", data);
  }

  private __ErrorHandler(event: any) {
    this.logger.error(`Native error! ${event["message"]}`);

    this.emit("error", event);
    this.Disconnect();
  }

  private __CloseHandler(event: any) {
    this.logger.info(
      `Success to disconnet from server ${this.config.websocket_address}`
    );

    this.emit("system.disconnect");
    this.emit("close", event);
  }
}
