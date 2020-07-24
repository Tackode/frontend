<template>
  <div class="wrapped-container c-medium c-center my-3">
    <div v-if="state === CheckinState.SCANNING">
      <h2>{{ $t('scan') }}</h2>
      <qrcode-stream class="full-screen" @decode="onDecode" @init="onInit" />
    </div>
    <p v-else-if="state === CheckinState.LOADING">
      {{ $t('wait') }}
    </p>
    <div v-else-if="state === CheckinState.NOTFOUND">
      <p>{{ $t('nex') }}</p>
      <nuxt-link class="no-print" :to="'/' + $i18n.locale">
        {{ $t('back') }}
      </nuxt-link>
    </div>
    <div v-else-if="state === CheckinState.LOADED">
      <PlaceView :data="place" />
      <b-card class="my-3">
        <b-form @submit="handleSubmit">
          <b-form-group
            v-if="$store.getters['session/localEmail'] !== null"
            :label="$t('email')"
            label-for="login-email"
            :description="$t('nevershare')"
          >
            <b-form-input
              id="login-email"
              v-model="email"
              type="email"
              readonly
              :placeholder="$t('emai')"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            v-else
            :label="$t('email')"
            label-for="login-email"
            :description="$t('nevershare')"
          >
            <b-form-input
              id="login-email"
              v-model="email"
              type="email"
              required
              :placeholder="$t('emai')"
            ></b-form-input>
          </b-form-group>

          <b-form-group>
            <b-form-checkbox
              v-model="storeEmail"
              :value="true"
              :unchecked-value="false"
            >
              {{ $t('store') }}
            </b-form-checkbox>
          </b-form-group>

          <p>{{ $t('stay') }} {{ duration }} {{ $t('re') }}</p>

          <b-button type="submit" variant="primary" block>
            {{ $t('sub') }}
          </b-button>
        </b-form>
      </b-card>
    </div>
    <p v-else-if="state === CheckinState.CHECKMAIL">
      {{ $t('ema') }}
    </p>
    <div v-else-if="state === CheckinState.ERROR">
      <h2>{{ $t('scanimpossible') }}</h2>
      <br />
      <b> {{ $t(error) }}</b>
      <p>{{ $t(retry) }}</p>
      <br />
      <nuxt-link class="no-print" :to="'/' + $i18n.locale + '/'">
        {{ $t('back') }}
      </nuxt-link>
    </div>
  </div>
</template>

<i18n>
{
    "en": {
    "back":"Back to home page",
    "nex":"This place does not exist.",
    "stay":"If you stay more than",
    "re":"minutes, please, recheckin.",
    "wait":"Loading. Please wait...",
    "ema":"An email has been sent to your mailbox. Please, click on the connection link in the mail.",
    "nevershare":"We'll never share your email with anyone else.",
    "store":"Store my email address to be warned whenever a contact was infected by the Covid-19.",
    "sub":"Do a Checkin-In",
    "email":"Email address*",
    "emai":"Enter your email",
    "scan":"Scan a QR Code",
    "scanimpossible":"Scan Impossible",
    "retrydevice":"Retry with a compatible device",
    "retryop":"Please allow the use of the camera and retry",
    "nocam":"You have no camera on this device",
    "noallow":"You need to grant camera access permisson",
    "sec":"Secure context required (HTTPS, localhost)",
    "retry":"Please, fix the error and retry",
    "inuse":"Is the camera already in use?",
    "over":"Installed cameras are not suitable",
    "stream":"Stream API is not supported in this browser",
    "A network error has occurred. Please, try again.":"A network error has occurred. Please, try again."
  },
  "fr": {
    "back":"Retour à la page d'accueil",
    "nex":"Ce lieu n'existe plus.",
    "stay":"Si vous restez plus de",
    "re":"minutes, veuillez vous réenregistrer.",
    "wait":"Chargement en cours...",
    "ema":"Un e-mail a été envoyé dans votre boîte mail. Veuillez cliquer sur le lien dans l'e-mail pour vous connecter.",
    "nevershare":"Nous ne partagerons jamais votre mail avec autrui.",
    "store":"Conserver mon adresse email pour être informé si un contact est infecté par le Covid.",
    "sub":"Valider le Check-In",
    "email":"Adresse mail*",
    "emai":"Entrer votre mail",
    "scan":"Scanner un QR Code",
    "scanimpossible":"Scan Impossible",
    "retrydevice":"Reéssayer avec un appareil compatible",
    "retryop":"Veuillez autoriser l'accès à la caméra puis réessayer",
    "nocam":"Vous n'avez pas de caméra sur cet appareil",
    "noallow":"Vous devez permettre l'accès à la caméra pour scanner",
    "sec":"Contexte sécurisé requis (HTTPS, localhost)",
    "retry":"Corrigez l'erreur et réessayez",
    "inuse":"Votre caméra est déjà utilisée ?",
    "over":"La caméra installée n'est pas compatible",
    "stream":"La vidéo n'est pas supportée sur votre appareil",
    "A network error has occurred. Please, try again.":"Une erreur réseau est survenue. S'il vous plait, veuillez réessayer."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Place } from '../types/Place'
import { showError } from '../helpers/alerts'
import PlaceView from '../components/PlaceView.vue'

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
    PlaceView,
  },
})
export default class CheckIn extends Vue {
  state: CheckinState = CheckinState.LOADING
  place: Place | null = null
  duration: string = ''
  email: string | null = this.$store.getters['session/localEmail']
  error: string = ''
  storeEmail = true
  retry: string = ''

  // Bind enum for Vue
  CheckinState = CheckinState

  async mounted() {
    const placeId = this.$route.query.placeId

    if (
      !this.$store.getters['session/localEmail'] &&
      this.$store.getters['session/email']
    ) {
      this.email = this.$store.getters['session/email']
      this.$store.dispatch('session/sendLocalEmail', this.email)
    }
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

    if (
      this.$store.getters['session/login'] !== null &&
      this.$store.getters['session/localEmail'] === this.email
    ) {
      try {
        await this.$axios.$post(
          '/checkin',
          {
            placeId: this.place.id,
            email: this.email,
            storeEmail: this.storeEmail,
            duration: parseInt(this.duration),
          },
          {
            auth: {
              username: this.$store.getters['session/login'],
              password: this.$store.getters['session/token'],
            },
          }
        )
      } catch (error) {
        showError(
          this.$bvToast,
          'Checkin',
          new Error(
            this.$i18n.t(
              'A network error has occurred. Please, try again.'
            ) as string
          )
        )
        return
      }

      this.$store.dispatch('session/setLocalEmail', this.email)

      this.state = CheckinState.FINISH
      this.$router.replace('/' + this.$i18n.locale + '/user/check-ins')
    } else {
      try {
        await this.$axios.$post('/checkin', {
          placeId: this.place.id,
          email: this.email,
          storeEmail: this.storeEmail,
          duration: parseInt(this.duration),
        })
      } catch (error) {
        showError(
          this.$bvToast,
          'Checkin',
          new Error(
            this.$i18n.t(
              'A network error has occurred. Please, try again.'
            ) as string
          )
        )
        return
      }

      this.state = CheckinState.CHECKMAIL
    }
  }

  onDecode(result: string) {
    document.location.href = result
  }

  async onInit(promise: any) {
    try {
      await promise
    } catch (error) {
      this.state = CheckinState.ERROR
      if (error.name === 'NotAllowedError') {
        this.error = 'noallow'
        this.retry = 'retryop'
      } else if (error.name === 'NotFoundError') {
        this.error = 'nocam'
        this.retry = 'retrydevice'
      } else if (error.name === 'NotSupportedError') {
        this.error = 'sec'
        this.retry = 'retry'
      } else if (error.name === 'NotReadableError') {
        this.error = 'inuse'
        this.retry = 'retry'
      } else if (error.name === 'OverconstrainedError') {
        this.error = 'over'
        this.retry = 'retrydevice'
      } else if (error.name === 'StreamApiNotSupportedError') {
        this.error = 'stream'
        this.retry = 'retrydevice'
      }
    }
  }
}
</script>

<style></style>
