<template>
  <LoginFrame mode="signup"></LoginFrame>
</template>

<i18n>
{
  "en": {
    "titlePage": "Signup"
  },
  "fr": {
    "titlePage": "Inscription"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'

@Component({
  components: {
    LoginFrame: () => import('../components/login/LoginFrame.vue'),
  },
  head(this: Signup) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
})
export default class Signup extends Vue {}
</script>
