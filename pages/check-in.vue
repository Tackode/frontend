<template>
  <div
    v-if="state === CheckinState.SCANNING"
    class="wrapped-container container"
  >
    <h2>{{ $t('scan') }}</h2>
    <br />
    <qrcode-stream @decode="onDecode" @init="onInit" />
    <p>
      <b> {{ $t(error) }}</b>
    </p>

    <br />
    {{ $t('sca') }}
  </div>
  <p
    v-else-if="state === CheckinState.LOADING"
    class="wrapped-container container"
  >
    {{ $t('wait') }}
  </p>
  <p
    v-else-if="state === CheckinState.NOTFOUND"
    class="wrapped-container container"
  >
    {{ $t('nex') }}
  </p>
  <div
    v-else-if="state === CheckinState.LOADED"
    class="wrapped-container container"
  >
    <b-form @submit="handleSubmit">
      <b-card v-if="place" class="mb-4">
        <h2>{{ place.organization.name }}</h2>
        <h2>
          <b>{{ place.name }}</b>
        </h2>
        <h5>
          {{ place.description }}
        </h5>
      </b-card>
      <b-card class="mb-2">
        <b-form-group
          v-if="$store.getters['session/email'] !== null"
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

        <div>
          <input id="storeemail" type="checkbox" name="scales" checked />
          <label for="storeemail">
            {{ $t('store') }}
          </label>
        </div>
        <br />
        {{ $t('stay') }} {{ duration }} {{ $t('re') }}
        <br />
        <br />
        <b-button type="submit" variant="primary"> {{ $t('sub') }} </b-button>
      </b-card>
    </b-form>
  </div>
  <p v-else-if="state === CheckinState.CHECKMAIL">
    {{ $t('ema') }}
  </p>
</template>

<i18n>
{
    "en": {
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
    "sca":"Scanning",
    "nocam":"ERROR: No camera on this device",
    "noallow":"ERROR: You need to grant camera access permisson",
    "sec":"ERROR: secure context required (HTTPS, localhost)",
    "inuse":"ERROR: is the camera already in use?",
    "over":"ERROR: installed cameras are not suitable",
    "stream":"ERROR: Stream API is not supported in this browser"
  },
  "fr": {
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
    "sca":"Scan en cours",
    "nocam":"ERREUR : Pas de caméra sur cet appareil",
    "noallow":"ERREUR : Vous devez permettre l'accès à la caméra pour scanner",
    "sec":"ERREUR: Contexte sécurisé requis (HTTPS, localhost)",
    "inuse":"ERREUR: Votre caméra est déjà utilisée ?",
    "over":"ERREUR: La caméra installée n'est pas compatible",
    "stream":"ERREUR: La vidéo n'est pas supportée sur votre appareil"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Place } from '../types/Place'
import { showError } from '../helpers/alerts'

enum CheckinState {
  SCANNING,
  LOADING,
  LOADED,
  ERROR,
  NOTFOUND,
  CHECKMAIL,
  FINISH,
}

@Component({})
export default class CheckIn extends Vue {
  state: CheckinState = CheckinState.LOADING
  place: Place | null = null
  duration: string = ''
  email: string | null = this.$store.getters['session/localEmail']
  error: string = ''
  storeEmail = true

  CheckinState = CheckinState

  async mounted() {
    const placeId = this.$route.query.placeId

    if (!placeId) {
      this.state = CheckinState.SCANNING

      return
    }

    try {
      this.place = await this.$axios.$get(`/place/${placeId}`)
    } catch (error) {
      this.state = CheckinState.NOTFOUND
      showError(this.$bvToast, 'Checkin', new Error('Place not found.'))
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

    if (this.$store.getters['session/login'] !== null) {
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
          new Error('A network error occured. Please, try again.')
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
          new Error('A network error occured. Please, try again.')
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
      if (error.name === 'NotAllowedError') {
        this.error = 'noallow'
      } else if (error.name === 'NotFoundError') {
        this.error = 'nocam'
      } else if (error.name === 'NotSupportedError') {
        this.error = 'sec'
      } else if (error.name === 'NotReadableError') {
        this.error = 'inuse'
      } else if (error.name === 'OverconstrainedError') {
        this.error = 'over'
      } else if (error.name === 'StreamApiNotSupportedError') {
        this.error = 'stream'
      }
    }
  }
}
</script>

<style></style>
