<template>
  <div class="wrapped-container c-medium c-center my-3">
    <div v-if="state === CheckinState.SCANNING">
      <h2>{{ $t('scan') }}</h2>
      <qrcode-stream @decode="onDecode" @init="onInit" />
    </div>

    <p v-else-if="state === CheckinState.LOADING">
      {{ $t('pleaseWait') }}
    </p>

    <div v-else-if="state === CheckinState.NOTFOUND">
      <p>{{ $t('notExists') }}</p>
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
            :description="$t('neverShare')"
          >
            <b-form-input
              id="login-email"
              v-model="email"
              type="email"
              readonly
              :placeholder="$t('enterEmail')"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            v-else
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

          <b-form-group>
            <b-form-checkbox
              v-model="storeEmail"
              :value="true"
              :unchecked-value="false"
            >
              {{ $t('store') }}
            </b-form-checkbox>
          </b-form-group>

          <p>{{ $t('stay') }} {{ duration }} {{ $t('reconnect') }}</p>

          <b-button type="submit" variant="primary" block>
            {{ $t('submit') }}
          </b-button>
        </b-form>
      </b-card>
    </div>

    <p v-else-if="state === CheckinState.CHECKMAIL">
      {{ $t('emailMailbox') }}
    </p>

    <div v-else-if="state === CheckinState.ERROR">
      <h2>{{ $t('scanImpossible') }}</h2>

      <p>
        <b>{{ $t(error) }}</b>
      </p>
      <p>{{ $t(retry) }}</p>

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
    "notExists":"This place does not exist.",
    "stay":"If you stay more than",
    "reconnect":"minutes, please, recheckin.",
    "pleaseWait":"Loading. Please wait...",
    "emailMailbox":"An email has been sent to your mailbox. Please, click on the connection link in the mail.",
    "neverShare":"We'll never share your email with anyone else.",
    "store":"Store my email address to be warned whenever a contact was infected by the Covid-19.",
    "submit":"Do a Checkin-In",
    "email":"Email address*",
    "enterEmail":"Enter your email",
    "scan":"Scan a QR Code",
    "scanImpossible":"Scan Impossible",
    "retryDevice":"Retry with a compatible device",
    "retryOperation":"Please allow the use of the camera and retry",
    "noCamera":"You have no camera on this device",
    "notAllowed":"You need to grant camera access permisson",
    "secureContext":"Secure context required (HTTPS, localhost)",
    "retry":"Please, fix the error and retry",
    "inUse":"Is the camera already in use?",
    "notSuitable":"Installed cameras are not suitable",
    "streamAPINotSupported":"Stream API is not supported in this browser",
    "networkError":"A network error has occurred. Please, try again.",
    "errorUnknown":"Unknown error",
    "titlePage":"Covid Journal - Checkin",
    "notFound":"Covid Journal - Unknown place",
    "errorTitle":"Covid Journal - Error",
    "scanTitle":"Covid Journal - Scanning"
  },
  "fr": {
    "back":"Retour à la page d'accueil",
    "notExists":"Ce lieu n'existe plus.",
    "stay":"Si vous restez plus de",
    "reconnect":"minutes, veuillez vous réenregistrer.",
    "pleaseWait":"Chargement en cours...",
    "emailMailbox":"Un e-mail a été envoyé dans votre boîte mail. Veuillez cliquer sur le lien dans l'e-mail pour vous connecter.",
    "neverShare":"Nous ne partagerons jamais votre mail avec autrui.",
    "store":"Conserver mon adresse email pour être informé si un contact est infecté par le Covid.",
    "submit":"Valider le Check-In",
    "email":"Adresse mail*",
    "enterEmail":"Entrer votre mail",
    "scan":"Scanner un QR Code",
    "scanImpossible":"Scan Impossible",
    "retryDevice":"Reéssayer avec un appareil compatible",
    "retryOperation":"Veuillez autoriser l'accès à la caméra puis réessayer",
    "noCamera":"Vous n'avez pas de caméra sur cet appareil",
    "notAllowed":"Vous devez permettre l'accès à la caméra pour scanner",
    "secureContext":"Contexte sécurisé requis (HTTPS, localhost)",
    "retry":"Corrigez l'erreur et réessayez",
    "inUse":"Votre caméra est déjà utilisée ?",
    "notSuitable":"La caméra installée n'est pas compatible",
    "streamAPINotSupported":"La vidéo n'est pas supportée sur votre appareil",
    "networkError":"Une erreur réseau est survenue. S'il vous plait, veuillez réessayer.",
    "errorUnknown":"Erreur inconnue",
    "titlePage":"Covid Journal - Checkin",
    "notFound":"Covid Journal - Lieu inconnu",
    "errorTitle":"Covid Journal - Erreur",
    "scanTitle":"Covid Journal - Scan en cours"

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
    document.title = this.$i18n.t('titlePage') as string
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
      document.title = this.$i18n.t('notFound') as string
      return
    }
    this.duration = `${this.place?.averageDuration}`
    this.state = CheckinState.LOADED
    document.title = `Covid Journal - ${this.place?.name}`
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
          new Error(this.$i18n.t('networkError') as string)
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
          new Error(this.$i18n.t('networkError') as string)
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
      document.title = this.$i18n.t('scanTitle') as string
      await promise
    } catch (error) {
      this.state = CheckinState.ERROR
      document.title = this.$i18n.t('errorTitle') as string
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
        this.error = 'errorUnknown'
        this.retry = 'retry'
      }
    }
  }
}
</script>

<style></style>
