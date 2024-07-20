import { Client } from "./client";
const client = new Client(/* user_id */ 123456, {
  websocket_address: "ws://111.222.11.22:12345",
  accent_token: "ASimpleToken",
});

// More see src
client.Start().then(() => {
  client.on("~~~~~~~~~~~~~~~~~~~", () => {});
});
