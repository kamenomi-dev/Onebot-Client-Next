import EventEmitter from "eventemitter3";
import WebSocket from "ws";
import LoggerProvider, { Logger } from "./logger";
import { IOnebotExports } from "./interface";
import { MessageEvent, TElements } from "./message";

export type TClientConfig = {
  websocket_address: string;
  accent_token?: string;
};

export class BaseClient extends EventEmitter {
  public connection?: WebSocket;
  public logger: Logger;

  public constructor(public readonly bot_user_id: number, public readonly config: TClientConfig) {
    super();
    this.logger = LoggerProvider.getLogger(`Client.${bot_user_id}`);
  }

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

  public Disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = undefined;
    }
  }

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
      var messageHandler = (data: any) => {
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
   * @param context
   * @param operation
   */
  public QuickCallApi(context: object, operation: object) {
    return this.CallApi(".handle_quick_operation", {
      context,
      operation,
    });
  }

  public QuickReply(from: MessageEvent.TPrivateMessageEvent, context: TElements, auto_escape?: boolean): void;
  public QuickReply(
    from: MessageEvent.TGroupMessageEvent,
    context: TElements,
    auto_escape?: boolean,
    at_sender?: boolean,
    deleteMsg?: boolean,
    operator_action?: { kick?: boolean; ban: boolean; ban_duration?: number },
  ): void;
  public QuickReply(
    from: MessageEvent.TMessageEvent,
    context: TElements,
    auto_escape?: boolean,
    at_sender?: boolean,
    deleteMsg?: boolean,
    operator_action?: { kick?: boolean; ban: boolean; ban_duration?: number },
  ) {
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

  public Send(data: Record<string, any>) {
    this.connection?.send(JSON.stringify(data));
  }

  private __OpenHandler(event: WebSocket.Event) {
    this.logger.debug(
      `Success to connect server ${this.config.websocket_address} with token ${this.config.accent_token}`,
    );

    this.emit("open", event);
  }

  private __MessageHandler(event: WebSocket.MessageEvent) {
    this.logger.debug(`Message Received! ${event.data}`);

    let jsonData = JSON.parse(event.data.toString());
    this.emit("data", jsonData);
  }

  private __ErrorHandler(event: WebSocket.ErrorEvent) {
    this.logger.error(`Native error! ${event}`);
    this.emit("error", event);
  }

  private __CloseHandler(event: WebSocket.CloseEvent) {
    this.logger.debug(`Success to disconnet from server ${this.config.websocket_address}`);

    this.emit("close", event);
  }
}
