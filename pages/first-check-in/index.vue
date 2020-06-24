<template>
  <div>
    {{ $t('check') }}
  </div>
</template>

<i18n>
{
  "en": {
    "check":"First Check in"
  },
  "fr": {
    "check":"Première connection"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class FirstCheckIn extends Vue {}
</script>

<style></style>
