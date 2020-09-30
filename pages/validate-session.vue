<template>
  <div class="wrapped-container c-small c-center my-3">
    <div v-if="state === ValidateState.LOADING">
      <Loader />
    </div>
    <Card v-else-if="state === ValidateState.FAILURE">
      <p class="title-2">{{ $t('alreadyValidated') }}</p>
      <p>
        {{ $t('alreadyValidatedRecovery') }}
      </p>
      <b-button type="submit" variant="primary" block>
        {{ $t('goToLogin') }}
      </b-button>
    </Card>
  </div>
</template>

<i18n>
{
  "en": {
    "parametersMissing": "Parameters are missing to connect. Please, click on the link that was received in the login email.",
    "alreadyValidated": "One time link already used",
    "alreadyValidatedRecovery": "It seems that you have already used this link, it is not valid anymore. Please request a new one.",
    "goToLogin": "Go to the login page",
    "titlePage": "Session validation"
  },
  "fr": {
    "parametersMissing": "Des paramètres sont manquants pour vous connecter. Veuillez cliquer sur le lien reçu dans l'email de connexion.",
    "alreadyValidated": "Lien unique déjà utilisé",
    "alreadyValidatedRecovery": "Il semblerait que vous ayez déjà utilisé ce lien pour vous connecter, il n'est donc plus valide. Veuillez en demander un nouveau.",
    "goToLogin": "Aller à la page de connexion",
    "titlePage": "Validation de la session"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { showError } from '../helpers/alerts'
import { Credentials } from '~/types/Session'

enum ValidateState {
  LOADING,
  FAILURE,
}

@Component({
  middleware: ['auth-guest'],
  components: {
    Loader: () => import('~/components/Loader.vue'),
    Card: () => import('~/components/Card.vue'),
  },
  head(this: ValidateDevice) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
})
export default class ValidateDevice extends Vue {
  state: ValidateState = ValidateState.LOADING
  sessionDelay: number | null = null

  // Bind enum for Vue
  ValidateState = ValidateState

  mounted() {
    // Retrieve device & session
    const sessionId = this.$route.query.sessionId as string | null
    const token = this.$route.query.token as string | null
    const redirect = (this.$route.query.redirect ?? 'checkins') as string
    const placeId = this.$route.query.placeId as string | null

    if (!sessionId || !token) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error(this.$i18n.t('parametersMissing') as string)
      )
      return
    }

    if (sessionId === this.$store.getters['session/login']) {
      // Already connected
      this.finish(redirect, placeId)
      return
    }

    if (process.client) {
      this.sessionDelay = window.setTimeout(async () => {
        let credentials: Credentials

        try {
          credentials = await this.$axios.$post<Credentials>(
            `/session/${sessionId}/validate`,
            { confirmationToken: token }
          )
        } catch (error) {
          this.state = ValidateState.FAILURE
          return
        }

        this.$store.commit('session/setSession', {
          login: credentials.login,
          token: credentials.token,
          email: credentials.user.email,
          role: credentials.user.role,
        })

        this.finish(redirect, placeId)
      }, 200)
    }
  }

  beforeDestroy() {
    if (this.sessionDelay != null) {
      clearTimeout(this.sessionDelay)
      this.sessionDelay = null
    }
  }

  finish(redirect: string, placeId: string | null) {
    switch (redirect) {
      case 'checkinConfirmation':
        this.$router.replace({
          path: this.localePath('/check-in/'),
          query: {
            placeId,
            confirm: 'true',
          },
        })
        break
      case 'places':
        this.$router.replace(this.localePath('/organization/places/'))
        break
      case 'checkins':
        this.$router.replace(this.localePath('/user/check-ins/'))
        break
    }
  }
}
</script>
