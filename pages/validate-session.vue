<template>
  <div v-if="(state = ValidateState.LOADING)">
    {{ $t('validate-device') }}
  </div>
  <p v-else-if="(state = ValidateState.FAILURE)">
    {{ $t('validation-failed') }}
  </p>
</template>

<i18n>
{
  "en": {
    "validate-device":"Validate Device",
    "validation-failed":"Fail to connect you. Please, retry to connect. "
  },
  "fr": {
    "validate-device":"Appareil Validé",
    "validation-failed":"Echec à la connexion. S'il vous plaît, veuillez vous reconnecter."
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
  ValidateState = ValidateState
  i18n = new VueI18n({})
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
      this.state = ValidateState.FAILURE
      return
    }

    this.$store.dispatch('session/setSession', result)

    this.$router.replace('/' + this.$i18n.locale + '/user/check-ins')
  }
}
</script>

<style></style>
