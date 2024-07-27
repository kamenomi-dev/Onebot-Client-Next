import { Logger } from "ts-log";

export enum ELoggerLevel {
  debug,
  trace,
  info,
  warn,
  error,
}

export class ClientLogger implements Logger {
  public logger: Console;

  public constructor(private readonly logLevel: ELoggerLevel = ELoggerLevel.debug) {
    this.logger = console;
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    if (ELoggerLevel.debug >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }

  public trace(message?: any, ...optionalParams: any[]): void {
    if (ELoggerLevel.trace >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }

  public info(message?: any, ...optionalParams: any[]): void {
    if (ELoggerLevel.info >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    if (ELoggerLevel.warn >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }

  public error(message?: any, ...optionalParams: any[]): void {
    if (ELoggerLevel.error >= this.logLevel) {
      this.logger.debug(...arguments);
    }
  }
}
