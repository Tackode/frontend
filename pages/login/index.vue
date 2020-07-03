<template>
  <div class="wrapped-container container login">
    <b-form v-if="state === LoginState.IDLE" @submit="handleSubmit">
      <b-form-group
        :label="$t('add')"
        label-for="login-email"
        :description="$t('nevershare')"
      >
        <b-form-input
          id="login-email"
          v-model="email"
          type="email"
          required
          :placeholder="$t('email')"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary"> {{ $t('log') }} </b-button>
    </b-form>
    <p v-else-if="state === LoginState.CHECK_EMAIL">{{ $t('emai') }}</p>
    <p v-else-if="state === LoginState.LOADING">{{ $t('wait') }}</p>
  </div>
</template>

<i18n>
{
  "en": {
    "wait":"Loading. Please wait...",
    "emai":"An email has been sent to your mailbox. Please, click on the connection link in the mail.",
    "log":"Login",
    "nevershare":"We'll never share your email with anyone else.",
    "email":"Enter your email",
    "add":"Email address"
  },
  "fr": {
    "wait":"Chargement en cours...",
    "emai":"Un e-mail a été envoyé dans votre boîte mail. Veuillez cliquer sur le lien dans l'e-mail pour vous connecter.",
    "log":"Se connecter",
    "nevershare":"Nous ne partagerons jamais votre mail avec autrui.",
    "email":"Entrez votre adresse",
    "add":"Adresse mail"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../helpers/alerts'

enum LoginState {
  IDLE,
  CHECK_EMAIL,
  LOADING,
}

@Component
export default class Login extends Vue {
  state: LoginState = LoginState.IDLE
  email: string = ''

  // Bind enum for Vue
  LoginState = LoginState

  async handleSubmit(e: Event) {
    e.preventDefault()
    this.state = LoginState.LOADING
    try {
      await this.$axios.$post('/login', {
        email: this.email,
        role: 'Public',
        organizationName: null,
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error('A network error has occurred. Please, try again.')
      )
      return
    }

    this.state = LoginState.CHECK_EMAIL
    localStorage.emai = this.email
  }
}
</script>

<style></style>
