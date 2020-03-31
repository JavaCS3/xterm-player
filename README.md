![CI](https://github.com/JavaCS3/xterm-player/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/JavaCS3/xterm-player/branch/master/graph/badge.svg)](https://codecov.io/gh/JavaCS3/xterm-player)
[![npm version](https://img.shields.io/npm/v/xterm-player)](https://www.npmjs.com/package/xterm-player)
[![downloads](https://img.shields.io/npm/dw/xterm-player)](https://www.npmjs.com/package/xterm-player)
[![](https://data.jsdelivr.com/v1/package/npm/xterm-player/badge)](https://www.jsdelivr.com/package/npm/xterm-player)
[![gitter chat](https://badges.gitter.im/xterm-player/community.png)](https://gitter.im/xterm-player/community)

# XtermPlayer [中文文档](./README.zh.md)

This repo is intended to provide an alternative asciinema player. The original [player](https://github.com/asciinema/asciinema-player) is writtern in `ClojureScript`. I think it's hard for frontend people to contribute that directly. This project is intended to make it easier for people to contribute by using `Typescript`.

## [Demo](https://javacs3.github.io/xterm-player/)

![demo-gif](https://user-images.githubusercontent.com/4168698/77246289-beaeac00-6c60-11ea-93eb-c10506fe484e.gif)

## Usage

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

## Features

1. Support orginal asciinema [v1](https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v1.md), [v2](https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v2.md) format and features
2. Support [Terminalizer](https://github.com/faressoft/terminalizer-player) format
3. Support Audio

## How to record terminal session with audio

```shell
$ npm i -g xterm-recorder   # install xterm-recorder first
$ xterm-recorder rec        # exit terminal session will automatically save your recording to out.cast
```
check peer project https://github.com/JavaCS3/xterm-recorder for details

## Develop Guide

```shell
$ cd <repo> && yarn
$ yarn demo
$ yarn test
```
