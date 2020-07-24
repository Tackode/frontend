<template>
  <div class="wrapped-container c-small c-center my-3">
    <div v-if="state === ValidateState.LOADING">
      {{ $t('validate-device') }}
    </div>
    <p v-else-if="state === ValidateState.FAILURE">
      {{ $t('validation-failed') }}
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "validate-device":"Validate Device",
    "validation-failed":"Fail to connect you. Please, retry to connect. ",
    "A network error has occurred. Please, try again.":"A network error has occurred. Please, try again.",
    "Parameters are missing to connect. Please, click on the link that was received in the login email.":"Parameters are missing to connect. Please, click on the link that was received in the login email."
  },
  "fr": {
    "validate-device":"Appareil Validé",
    "validation-failed":"Echec à la connexion. S'il vous plaît, veuillez vous reconnecter.",
    "A network error has occurred. Please, try again.":"Une erreur réseau est survenue. S'il vous plait, veuillez réessayer.",
    "Parameters are missing to connect. Please, click on the link that was received in the login email.":"Des paramètres sont manquants pour vous connecter. Veuillez cliquer sur le lien reçu dans l'email de connexion."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Component from 'vue-class-component'
import { showError } from '../helpers/alerts'

Vue.use(VueI18n)

enum ValidateState {
  LOADING,
  FAILURE,
}

@Component({})
export default class ValidateDevice extends Vue {
  state: ValidateState = ValidateState.LOADING
  i18n = new VueI18n({})

  // Bind enum for Vue
  ValidateState = ValidateState

  async mounted() {
    // Retrieve device & session
    const sessionId = this.$route.query.sessionId
    const token = this.$route.query.token

    if (!sessionId || !token) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error(
          this.$i18n.t(
            'Parameters are missing to connect. Please, click on the link that was received in the login email.'
          ) as string
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
        new Error(
          this.$i18n.t(
            'A network error has occurred. Please, try again.'
          ) as string
        )
      )
      this.state = ValidateState.FAILURE
      return
    }

    this.$store.dispatch('session/setSession', result)

    this.$router.replace('/' + this.$i18n.locale + '/user/check-ins')
  }
}
</script>

<style></style>
