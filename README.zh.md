# XtermPlayer

本项目的设计初衷是提供`asciinema-player`的替代品。[asciinema-player](https://github.com/asciinema/asciinema-player)
是用`ClojureScript`实现的，我认为这门语言过于小众，大部分前端工程师很难直接参与贡献。
因此本项目希望利用`Typescript`让项目的贡献变得简单一点。
当然还远不止这些！

## [Demo展示](https://javacs3.github.io/xterm-player/)

![demo-gif](https://user-images.githubusercontent.com/4168698/77246289-beaeac00-6c60-11ea-93eb-c10506fe484e.gif)

## 使用方法

```html
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm-player@latest/dist/css/xterm-player.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/xterm@4.4.0/lib/xterm.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xterm-player@latest/dist/js/xterm-player.min.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script>
      const div = document.getElementById('app')
      const player = new XtermPlayer.XtermPlayer(
        'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/1.cast',
        div
      )
    </script>
  </body>
</html>
```

## 功能特色

1. 支持 asciinema [v1](https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v1.md), [v2](https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v2.md) 文件格式和功能
2. 支持 [Terminalizer](https://github.com/faressoft/terminalizer-player) 文件格式
3. 支持嵌入音频

## 如何录制一个带有声音的终端录屏

```shell
$ npm i -g xterm-recorder   # 首先安装 xterm-recorder
$ xterm-recorder rec        # 进程退出后会自动保存至 out.cast
```
更多使用方法请查阅 https://github.com/JavaCS3/xterm-recorder

## 如何开发

```shell
$ cd <repo> && yarn
$ yarn demo
$ yarn test
```
