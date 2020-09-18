<template>
  <div class="wrapped-container c-small c-center my-3">
    <div v-if="state === ValidateState.LOADING">
      {{ $t('validateDevice') }}
    </div>
    <p v-else-if="state === ValidateState.FAILURE">
      {{ $t('validationFailed') }}
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "validateDevice":"Validate Device",
    "validationFailed":"Fail to connect you. Please, retry to connect. ",
    "networkError":"A network error has occurred. Please, try again.",
    "parametersMissing":"Parameters are missing to connect. Please, click on the link that was received in the login email.",
    "titlePage":"Covid Journal - Validation in progress"
  },
  "fr": {
    "validateDevice":"Appareil Validé",
    "validationFailed":"Echec à la connexion. S'il vous plaît, veuillez vous reconnecter.",
    "networkError":"Une erreur réseau est survenue. S'il vous plait, veuillez réessayer.",
    "parametersMissing":"Des paramètres sont manquants pour vous connecter. Veuillez cliquer sur le lien reçu dans l'email de connexion.",
    "titlePage":"Covid Journal - Validation en cours"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { Component } from 'nuxt-property-decorator'
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
    document.title = this.$i18n.t('titlePage') as string
    const sessionId = this.$route.query.sessionId
    const token = this.$route.query.token

    if (!sessionId || !token) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error(this.$i18n.t('parametersMissing') as string)
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
        new Error(this.$i18n.t('networkError') as string)
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
