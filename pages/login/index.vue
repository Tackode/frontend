<template>
  <div class="login">
    <b-form v-if="state === LoginState.IDLE" @submit="handleSubmit">
      <b-form-group
        label="Email address:"
        label-for="login-email"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="login-email"
          v-model="email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
    <p v-else-if="state === LoginState.CHECK_EMAIL">
      An email has been sent to your mailbox. Please, click on the connection
      link in the mail.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../helpers/alerts'

enum LoginState {
  IDLE,
  CHECK_EMAIL
}

@Component
export default class Login extends Vue {
  state: LoginState = LoginState.IDLE
  email: string = ''

  // Bind enum for Vue
  LoginState = LoginState

  async handleSubmit(e: Event) {
    e.preventDefault()

    try {
      await this.$axios.$post('/login', {
        email: this.email,
        role: 'Public',
        organizationName: null
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
  }
}
</script>

<style>
.login {
  padding-top: 30px;
}
</style>
