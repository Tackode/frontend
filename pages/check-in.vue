<template>
  <div>
    <div
      v-if="state === CheckinState.SCANNING"
      class="wrapped-container c-large c-center my-3"
    >
      <h2>{{ $t('scan') }}</h2>
      <qrcode-stream @decode="onDecode" @init="onInit" :worker="QRWorker" />
    </div>

    <div
      v-if="state === CheckinState.LOADING"
      class="wrapped-container c-small c-center my-3"
    >
      <Loader />
    </div>

    <div
      v-if="state === CheckinState.NOTFOUND"
      class="wrapped-container c-small c-center my-3"
    >
      <p>{{ $t('notExists') }}</p>
      <nuxt-link class="no-print" :to="localePath('/')">
        {{ $t('back') }}
      </nuxt-link>
    </div>

    <div
      v-if="state === CheckinState.LOADED"
      class="wrapped-container c-small c-center my-3"
    >
      <PlaceView :data="place" />
      <Card class="my-3 text-left">
        <b-form @submit="handleSubmit">
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

          <b-button type="submit" variant="primary" block>
            {{ $t('submit') }}
          </b-button>
        </b-form>
      </Card>
    </div>

    <div
      v-if="state === CheckinState.CHECKMAIL"
      class="wrapped-container c-small c-center my-3"
    >
      <PlaceView :data="place" />
      <EmailSent :email="email" />
    </div>

    <div
      v-if="state === CheckinState.FINISH"
      class="wrapped-container c-small c-center my-3"
    >
      <PlaceView :data="place" />
      <Card>
        <p class="title-1">{{ $t('thankYou') }}</p>
        <p>
          {{ $t('saferWorld') }}
        </p>
        <img
          class="img-fluid"
          src="~/assets/images/thank-you.png"
          srcset="
              ~/assets/images/thank-you.png    1x,
              ~/assets/images/thank-you@2x.png 2x
              ~/assets/images/thank-you@3x.png 3x
            "
        />
      </Card>
    </div>

    <div v-else-if="state === CheckinState.ERROR">
      <h2>{{ $t('scanImpossible') }}</h2>

      <p>
        <b>{{ $t(error) }}</b>
      </p>
      <p>{{ $t(retry) }}</p>

      <nuxt-link class="no-print" :to="localePath('/')">
        {{ $t('back') }}
      </nuxt-link>
    </div>
  </div>
</template>

<i18n>
{
    "en": {
    "back": "Back to home page",
    "notExists": "This place does not exist.",
    "submit": "Do a Checkin-In",
    "email": "Email address*",
    "enterEmail": "Enter your email",
    "neverShare": "We'll never share your email with anyone else.",
    "scan": "Scan a QR Code",
    "scanImpossible": "Scan Impossible",
    "retryDevice": "Retry with a compatible device",
    "retryOperation": "Please allow the use of the camera and retry",
    "noCamera": "You have no camera on this device",
    "notAllowed": "You need to grant camera access permisson",
    "secureContext": "Secure context required (HTTPS, localhost)",
    "retry": "Please, fix the error and retry",
    "inUse": "Is the camera already in use?",
    "notSuitable": "Installed cameras are not suitable",
    "streamAPINotSupported": "Stream API is not supported in this browser",
    "networkError": "A network error has occurred. Please, try again.",
    "errorUnknown": "Unknown error",
    "titlePage": "Checkin",
    "thankYou": "Thank you!",
    "saferWorld": "You have contributed to make this world a better place for everyone"
  },
  "fr": {
    "back": "Retour à la page d'accueil",
    "notExists": "Ce lieu n'existe plus.",
    "submit": "Valider le Check-In",
    "email": "Adresse mail*",
    "enterEmail": "Entrer votre mail",
    "neverShare": "Nous ne partagerons jamais votre mail avec autrui.",
    "scan": "Scanner un QR Code",
    "scanImpossible": "Scan Impossible",
    "retryDevice": "Reéssayer avec un appareil compatible",
    "retryOperation": "Veuillez autoriser l'accès à la caméra puis réessayer",
    "noCamera": "Vous n'avez pas de caméra sur cet appareil",
    "notAllowed": "Vous devez permettre l'accès à la caméra pour scanner",
    "secureContext": "Contexte sécurisé requis (HTTPS, localhost)",
    "retry": "Corrigez l'erreur et réessayez",
    "inUse": "Votre caméra est déjà utilisée ?",
    "notSuitable": "La caméra installée n'est pas compatible",
    "streamAPINotSupported": "La vidéo n'est pas supportée sur votre appareil",
    "networkError": "Une erreur réseau est survenue. S'il vous plait, veuillez réessayer.",
    "errorUnknown": "Erreur inconnue",
    "titlePage": "Checkin",
    "thankYou": "Merci !",
    "saferWorld": "Vous avez contribué à faire de cet endroit un lieu plus sûr pour tout le monde"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { Place } from '../types/Place'
import { showError } from '../helpers/alerts'
import QRWorker from '../helpers/jsqr'

enum CheckinState {
  SCANNING,
  LOADING,
  LOADED,
  ERROR,
  NOTFOUND,
  CHECKMAIL,
  FINISH,
}

@Component({
  components: {
    PlaceView: () => import('~/components/PlaceView.vue'),
    Card: () => import('~/components/Card.vue'),
    EmailSent: () => import('~/components/EmailSent.vue'),
    Loader: () => import('~/components/Loader.vue'),
  },
  head(this: CheckIn) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
})
export default class CheckIn extends Vue {
  state: CheckinState = CheckinState.LOADING
  place: Place | null = null
  duration: string = ''
  email: string | null = null
  error: string = ''
  storeEmail = true
  retry: string = ''

  // Bind enum for Vue
  CheckinState = CheckinState
  QRWorker = QRWorker

  async mounted() {
    this.email = this.$store.getters['session/localEmail']

    await this.setPlaceId(this.$route.query.placeId as string | null)
  }

  async setPlaceId(placeId: string | null) {
    if (!placeId) {
      this.state = CheckinState.SCANNING
      return
    }

    try {
      this.place = await this.$axios.$get(`/place/${placeId}`)
    } catch (error) {
      this.state = CheckinState.NOTFOUND
      return
    }

    this.duration = `${this.place?.averageDuration}`
    this.state = CheckinState.LOADED
  }

  async handleSubmit(e: Event) {
    e.preventDefault()

    if (!this.place) {
      return
    }

    const data = {
      placeId: this.place.id,
      email: this.email,
      storeEmail: true,
      duration: parseInt(this.duration),
    }

    // Will logout if this.email !== localEmail
    this.$store.dispatch('session/setLocalEmail', this.email)

    try {
      await this.$axios.$post('/checkin', data)
    } catch (error) {
      showError(
        this.$bvToast,
        'Checkin',
        new Error(this.$i18n.t('networkError') as string)
      )
      return
    }

    if (this.$store.getters['session/login'] !== null) {
      this.state = CheckinState.FINISH
    } else {
      this.state = CheckinState.CHECKMAIL
    }
  }

  async onDecode(url: string) {
    const queryIndex = url.indexOf('?')
    if (queryIndex === -1) {
      return
    }

    const query = url.substring(queryIndex)
    const params = new URLSearchParams(query)
    const placeId = params.get('placeId')

    if (placeId == null || placeId.length !== 36) {
      return
    }

    await this.setPlaceId(placeId)
  }

  async onInit(promise: any) {
    try {
      await promise
    } catch (error) {
      if (error === 'TypeError: r.getCapabilities is not a function') {
        return
      }

      this.state = CheckinState.ERROR

      if (error.name === 'NotAllowedError') {
        this.error = 'notAllowed'
        this.retry = 'retryOperation'
      } else if (error.name === 'NotFoundError') {
        this.error = 'noCamera'
        this.retry = 'retryDevice'
      } else if (error.name === 'NotSupportedError') {
        this.error = 'secureContext'
        this.retry = 'retry'
      } else if (error.name === 'NotReadableError') {
        this.error = 'inUse'
        this.retry = 'retry'
      } else if (error.name === 'OverconstrainedError') {
        this.error = 'notSuitable'
        this.retry = 'retryDevice'
      } else if (error.name === 'StreamApiNotSupportedError') {
        this.error = 'streamAPINotSupported'
        this.retry = 'retryDevice'
      } else {
        this.error = error
        this.retry = 'retry'
      }
    }
  }
}
</script>
