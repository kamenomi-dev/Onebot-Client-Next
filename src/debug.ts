import { Client } from "./client.js";
import { Group } from "./group.js";
import { ELoggerLevel } from "./logger.js";

const client = new Client(/* user_id */ 222, {
  websocket_address: "ws://127.0.0.1:19132",
  accent_token: "a_simple_token",
  options: {
    log_level: ELoggerLevel.info
  }
});

// More see src
let lastDragon = 0;
client.Start().then(() => {
  client.on("message.group.normal", (msg) => {
    if (msg.raw_message == "🏓 Ping") {
      msg.reply("🏓 Pong");
    }
  });

  console.log("a")
  const group = Group.As(client, 687741706);
  console.log(group)
  setInterval(() => {
    console.log("1");

    group.GetHonorMembers("all").then((dragon) => {
      if (dragon.current_talkative!.user_id != lastDragon) {
        lastDragon = dragon.current_talkative!.user_id
        group.SendMsg(`${dragon.current_talkative!.nickname} 龙王，喷个水`);
      }
      console.log(dragon)
    }).catch(val => {
      console.log(val)
    });
  }, 1000 * 10);
});
