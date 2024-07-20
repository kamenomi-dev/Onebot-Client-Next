# Onebot-Client-Next

Onebot v11 客户端开发 SDK

> 谢谢来自 [凉菜](https://github.com/lc-cn) 仓库 [onebot-client](https://github.com/lc-cn/onebot-client) 的架构支持，本仓库由此进行重构。



## 安装

使用 npm 包管理器：

`npm i onebot-client-next`



## 使用方式

Part1. 连接服务器。

```typescript
import { Client } from "onebot-client-next"
const client = new Client(/*QQ号*/, {
  websocket_address: "", /* websocket 正/反向连接 */
  access_token: "", /* 鉴权 token，可选 */
});

client.Start().then(() => {
  // to do so.
})
```



Part2. 监听事件

```typescript
// todo
```



## 特别感谢

1. 感谢 [LLOneBot](https://github.com/LLOneBot/LLOneBot) 提供的 Onebot v11 接口支持
2. 感谢 [凉菜](https://github.com/lc-cn/) 的 [Onebot-Client](https://github.com/lc-cn/onebot-client) SDK架构支持