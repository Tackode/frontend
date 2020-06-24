<template>
  <div>
    {{ $t('vd') }}
  </div>
</template>

<i18n>
{
  "en": {
    "vd":"Validate Device"
  },
  "fr": {
    "vd":"Appareil Validé"
  }
}
</i18n>

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
          'Parameters are missing to connect. Please, click on the link that was received in the login email.'
        )
      )
      return
    }

    let result: any
    try {
      result = await this.$axios.$post(`/session/${sessionId}/validate`, {
        confirmationToken: token,
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error('A network error has occurred. Please, try again.')
      )
      return
    }

    this.$store.dispatch('session/setSession', result)

    this.$router.replace('/guest/check-ins')
  }
}
</script>

<style></style>
