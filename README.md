![Node.js CI](https://github.com/JavaCS3/xterm-player/workflows/Node.js%20CI/badge.svg)

# XtermPlayer

This repo is intended to provide an alternative asciinema player. The original [player](<(https://github.com/asciinema/asciinema-player)>) is writtern in `Clojure`. I think it's hard for frontend people to contribute that directly. This project is intended to make it easier for people to contribute by using `Typescript`.

## [Live demo](https://javacs3.github.io/xterm-player/)

## Instructions

```shell
$ cd <repo> && yarn
$ yarn demo
$ yarn test
```

## Goals

1. Support orginal asciinema [v1](https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v1.md), [v2](https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v2.md) format and features
2. Support Audio
3. May Support Record Editing
