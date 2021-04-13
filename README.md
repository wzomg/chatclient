# chatclient

> 网页在线聊天系统前端

## Front-end Stack
> `Vue`、`Vuex`、`Element-UI`、`Axios`、`ES6`、`WebSocket`、`WebRTC`等。

## Description

- 启动本项目前，先修改一下`src/views/CoArtBoard.vue`和`src/views/CoVideo.vue`这2个文件中的`iceServers`参数值，即配置`coturn`中继服务器信息。如何搭建`coturn`服务器？[传送门](https://www.jianshu.com/p/7e9d0af05396)
- 若不想搭建`coturn`服务器，则白板协作、语音视频通话功能只能在本地进行。其中，`1v1`视频通话失败，因为需要两个不同的视频输出流，其它功能都使用正常。注意：将下面这行代码的参数去掉即可。

```js
this.peer = new PeerConnection(this.iceServers) //已搭建 coturn 服务器
this.peer = new PeerConnection() // 只在本地环境测试进行
```

- 打包并部署到服务器注意事项：[传送门](https://www.jianshu.com/p/83b76e62976b)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run build
```

## Reference

> 前端界面参考：https://github.com/CCZX/wechat
