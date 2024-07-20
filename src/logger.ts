import { LogLevel } from "typescript-logging";
import { Log4TSProvider } from "typescript-logging-log4ts-style";

const LoggerProvider = Log4TSProvider.createProvider("onebot.bot.next.logger", {
  level: LogLevel.Debug,
  groups: [
    {
      expression: new RegExp(".+"),
    },
  ],
});

export default LoggerProvider;
export { Logger } from "typescript-logging-log4ts-style"
