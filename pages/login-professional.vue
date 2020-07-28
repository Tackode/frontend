<template>
  <div class="wrapped-container c-small c-center my-3">
    <b-form v-if="state === LoginState.IDLE" @submit="handleSubmit">
      <b-form-group
        :label="$t('email')"
        label-for="login-email"
        :description="$t('neverShare')"
      >
        <b-form-input
          id="login-email"
          v-model="email"
          type="email"
          required
          :placeholder="$t('enterEmail')"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :label="$t('organizationName')"
        label-for="login-organization-name"
      >
        <b-form-input
          id="login-organization-name"
          v-model="organizationName"
          required
          :placeholder="$t('enterOrganizationName')"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary" block>
        {{ $t('login') }}
      </b-button>
    </b-form>
    <p v-else-if="state === LoginState.CHECK_EMAIL">{{ $t('emailSent') }}</p>
    <p v-else-if="state === LoginState.LOADING">{{ $t('pleaseWait') }}</p>
  </div>
</template>

<i18n>
{
  "en": {
    "pleaseWait":"Loading. Please wait...",
    "emailSent":"An email has been sent to your mailbox. Please, click on the connection link in the mail.",
    "login":"Login",
    "neverShare":"We'll never share your email with anyone else.",
    "enterEmail":"Enter your email",
    "email":"Email Address",
    "organizationName":"Organization name",
    "enterOrganizationName":"Enter your organization name",
    "networkError":"A network error has occurred. Please, try again."

  },
  "fr": {
    "pleaseWait":"Chargement en cours...",
    "emailSent":"Un e-mail a été envoyé dans votre boîte mail. Veuillez cliquer sur le lien dans l'e-mail pour vous connecter.",
    "login":"Se connecter",
    "neverShare":"Nous ne partagerons pas votre email.",
    "enterEmail":"Entrez votre adresse",
    "email":"Adresse mail",
    "organizationName":"Nom d'entreprise",
    "enterOrganizationName":"Nom de votre entreprise",
    "networkError":"Une erreur réseau est survenue. S'il vous plait, veuillez réessayer."

  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../helpers/alerts'

enum LoginState {
  IDLE,
  CHECK_EMAIL,
  LOADING,
}

@Component
export default class LoginProfessional extends Vue {
  state: LoginState = LoginState.IDLE
  email: string = ''
  organizationName: string = ''

  // Bind enum for Vue
  LoginState = LoginState

  async handleSubmit(e: Event) {
    e.preventDefault()
    this.state = LoginState.LOADING
    try {
      await this.$axios.$post('/login', {
        email: this.email,
        role: 'Professional',
        organizationName: this.organizationName,
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error(this.$i18n.t('networkError') as string)
      )
      return
    }

    this.state = LoginState.CHECK_EMAIL

    this.$store.dispatch('session/setLocalEmail', this.email)
  }
}
</script>

<style></style>
