<center><h1>Onebot Client Next</h1></center>

<center><img src="https://img.shields.io/npm/v/onebot-client-next"><img src="https://img.shields.io/github/release-date/kamenomi-dev/Onebot-Client-Next"><img src="https://img.shields.io/github/stars/kamenomi-dev/Onebot-Client-Next"><img src="https://img.shields.io/github/license/kamenomi-dev/Onebot-Client-Next"></center>

<center>一个基于 Onebot v11 协议开发的客户端 SDK</center>

<center> 本仓库参考自 <a herf="https://github.com/lc-cn/onebot-client">Onebot-Client</a> 架构</center>

<center><a herf="https://t.me/+5j_1ne6eJ-s5YjZl" ><img width=10%
                           src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDI0YzYuNjI3IDAgMTItNS4zNzMgMTItMTJTMTguNjI3IDAgMTIgMCAwIDUuMzczIDAgMTJzNS4zNzMgMTIgMTIgMTJaIiBmaWxsPSJ1cmwoI2EpIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjQyNSAxMS44NzFhNzk2LjQxNCA3OTYuNDE0IDAgMCAxIDYuOTk0LTMuMDE4YzMuMzI4LTEuMzg4IDQuMDI3LTEuNjI4IDQuNDc3LTEuNjM4LjEgMCAuMzIuMDIuNDcuMTQuMTIuMS4xNS4yMy4xNy4zMy4wMi4xLjA0LjMxLjAyLjQ3LS4xOCAxLjg5OC0uOTYgNi41MDQtMS4zNiA4LjYyMi0uMTcuOS0uNSAxLjE5OS0uODE5IDEuMjI5LS43LjA2LTEuMjI5LS40Ni0xLjg5OC0uOS0xLjA2LS42ODktMS42NDktMS4xMTktMi42NzgtMS43OTgtMS4xOS0uNzgtLjQyLTEuMjA5LjI2LTEuOTA4LjE4LS4xOCAzLjI0Ny0yLjk3OCAzLjMwNy0zLjIyOC4wMS0uMDMuMDEtLjE1LS4wNi0uMjEtLjA3LS4wNi0uMTctLjA0LS4yNS0uMDItLjExLjAyLTEuNzg4IDEuMTQtNS4wNTYgMy4zNDgtLjQ4LjMzLS45MDkuNDktMS4yOTkuNDgtLjQzLS4wMS0xLjI0OC0uMjQtMS44NjgtLjQ0LS43NS0uMjQtMS4zNDktLjM3LTEuMjk5LS43OS4wMy0uMjIuMzMtLjQ0Ljg5LS42NjlaIiBmaWxsPSIjZmZmIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMTEuOTkiIHkxPSIwIiB4Mj0iMTEuOTkiIHkyPSIyMy44MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMyQUFCRUUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMjlFRDkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K"></a><a><img with=10% ></center>

## 目录

[toc]

## 注意事项

>  [!IMPORTANT]
>
> 本项目主要对 [LLOnebot](https://github.com/LLOneBot/LLOneBot) 的 Onebot v11 协议接口进行封装，不保证提供的数据是否真实。

>  [!CAUTION]
>
> 在本项目或其衍生、依赖项目等有依赖于 [QQNTLiteLoader](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT) 的项目出现问题、需要反馈时，请勿在简中互联网中的平台上（例如 QQ、哔哩哔哩、知乎 等服务平台）进行以包含但不止截图、文本的形式反馈。

> [!CAUTION]
>
> 请勿将本项目或其衍生、依赖项目等传播在简中互联网的平台上。本项目本意在为个人开发者提供便利。



## 安装方式

使用 npm 包管理器：

`npm i onebot-client-next`



## 简单例子

```typescript
import { Client } from "onebot-client-next"

const client = new Client(114514, {
    websocket_address: "ws://127.0.0.1:8080",
    access_token: "452AFF0CC359C86C"
})

client.Start().then(() => {
   // 在成功连接后做点什么... 
});

client.on("message.group", (message) => {
    // 处理消息。
});
```



## 特别感谢

1. 感谢 [LLOneBot](https://github.com/LLOneBot/LLOneBot) 提供的 Onebot v11 接口支持
2. 感谢 [凉菜](https://github.com/lc-cn/) 的 [Onebot-Client](https://github.com/lc-cn/onebot-client) SDK架构支持