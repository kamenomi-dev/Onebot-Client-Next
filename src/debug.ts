import { Client } from "../lib/index.js";
import { Group } from "../lib/index.js";
import { ELoggerLevel } from "../lib/index.js";

const client = new Client(/* user_id */ 222, {
  websocket_address: "ws://127.0.0.1:19132",
  accent_token: "a_simple_token",
  options: {
    log_level: ELoggerLevel.info,
  },
});

// More see src
let lastDragon = 0;
client.Start().then(() => {
  client.on("message.group.normal", (msg) => {
    if (msg.raw_message == "🏓 Ping") {
      msg.reply("🏓 Pong");
    }

    if (msg.raw_message == "test") {
      for (let i = 4; i < 24; i++) {
        setTimeout(() => {
          msg.replyViaEmoji(i);
        }, Math.random() % 2000);
      }
    }
  });
});
