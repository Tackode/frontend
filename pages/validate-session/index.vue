<template>
  <div>
    Validate Device
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../helpers/alerts'

@Component({})
export default class ValidateDevice extends Vue {
  async mounted() {
    // Retrieve device & session
    const sessionId = this.$route.query.sessionId
    const token = this.$route.query.token

    if (!sessionId || !token) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error(
          'Des paramètres sont manquant pour vous connecter. Veuillez cliquer sur le lien qui a été reçu dans le mail de connexion.'
        )
      )
      return
    }

    let result: any
    try {
      result = await this.$axios.$post(`/session/${sessionId}/validate`, {
        confirmationToken: token
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

    this.$store.dispatch('session/setSession', result)

    this.$router.replace('/guest/check-ins')
  }
}
</script>

<style></style>
