<template>
  <div class="card">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'

@Component
export default class Card extends Vue {}
</script>

<style lang="scss" scoped>
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 15px 0 rgba($color: #000000, $alpha: 0.25);
  padding: 24px 42px;
}
</style>
