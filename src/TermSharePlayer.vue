<template>
  <div id="container"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import 'xterm/src/xterm.css'
import axios from 'axios'
import { Player } from './player'
import { AsciinemaCastParser } from './parser'
</script>
