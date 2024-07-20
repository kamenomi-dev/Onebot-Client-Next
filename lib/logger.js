"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_logging_1 = require("typescript-logging");
const typescript_logging_log4ts_style_1 = require("typescript-logging-log4ts-style");
const LoggerProvider = typescript_logging_log4ts_style_1.Log4TSProvider.createProvider("onebot.bot.next.logger", {
    level: typescript_logging_1.LogLevel.Debug,
    groups: [
        {
            expression: new RegExp(".+"),
        },
    ],
});
exports.default = LoggerProvider;
