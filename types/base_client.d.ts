import EventEmitter from "eventemitter3";
import WebSocket from "ws";
import { Logger } from "./logger";
import { IOnebotExports } from "./interface";
import { MessageEvent, TElements } from "./message";
export type TClientConfig = {
    websocket_address: string;
    accent_token?: string;
};
export declare class BaseClient extends EventEmitter {
    readonly bot_user_id: number;
    readonly config: TClientConfig;
    connection?: WebSocket;
    logger: Logger;
    constructor(bot_user_id: number, config: TClientConfig);
    Connect(): Promise<void>;
    Disconnect(): void;
    CallApi<T extends keyof IOnebotExports, R extends IOnebotExports[T]>(action: T, ...args: Parameters<R>): Promise<ReturnType<R>>;
    /**
     * @ignore Internal methods
     * @param context
     * @param operation
     */
    QuickCallApi(context: object, operation: object): Promise<void>;
    QuickReply(from: MessageEvent.TPrivateMessageEvent, context: TElements, auto_escape?: boolean): void;
    QuickReply(from: MessageEvent.TGroupMessageEvent, context: TElements, auto_escape?: boolean, at_sender?: boolean, deleteMsg?: boolean, operator_action?: {
        kick?: boolean;
        ban: boolean;
        ban_duration?: number;
    }): void;
    Send(data: Record<string, any>): void;
    private __OpenHandler;
    private __MessageHandler;
    private __ErrorHandler;
    private __CloseHandler;
}
//# sourceMappingURL=base_client.d.ts.map