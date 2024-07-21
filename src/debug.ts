import { Client } from "./client";
import Logger from "js-logger";

const client = new Client(/* user_id */ 222, {
  websocket_address: "ws://127.0.0.1:19132",
  accent_token: "a_simple_token",
  options: {
    logger_level: Logger.DEBUG
  }
});

// More see src
client.Start().then(() => {
  client.on("message.group.normal", (a) => {
    if (a.raw_message == "command.current_time") {
      a.reply((new Date).toLocaleTimeString());
    }
  });
});
