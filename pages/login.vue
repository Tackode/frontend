<template>
  <div class="wrapped-container c-large c-center my-3">
    <LoginFrame mode="login"></LoginFrame>
  </div>
</template>

<i18n>
{
  "en": {
    "titlePage": "Login"
  },
  "fr": {
    "titlePage": "Connexion"
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
  head(this: Login) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
})
export default class Login extends Vue {}
</script>

<style></style>
