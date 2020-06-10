<template>
  <div class="login">
    <b-form @submit="handleSubmit">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../helpers/alerts'

@Component
export default class Login extends Vue {
  email: string = ''

  async handleSubmit(e: Event) {
    e.preventDefault()

    try {
      await this.$axios.$post('/login', {
        email: this.email,
        providedDeviceId: null,
        role: 'Public',
        organizationName: null
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error(
          "Une erreur réseau s'est produite pendant la connexion. Veuillez réessayer."
        )
      )
      return
    }

    this.$router.replace('/guest/check-ins')
  }
}
</script>

<style>
.login {
  padding-top: 30px;
}
</style>
