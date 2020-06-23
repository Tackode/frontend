<template>
  <div v-if="state === CheckinState.SCANNING">
    <h2>Scan a QR Code</h2>
    <br />
    <qrcode-stream @decode="onDecode" @init="onInit" />
    <p>
      <b> {{ error }}</b>
    </p>
    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <br />
    Scanning QR Code
  </div>
  <p v-else-if="state === CheckinState.LOADING">Loading. Please wait...</p>
  <div v-else-if="state === CheckinState.LOADED">
    <b-form @submit="handleSubmit">
      <b-card v-if="place" class="mb-4">
        <h2>{{ place.organization.name }}</h2>
        <h2>
          <b>{{ place.name }}</b>
        </h2>
        <h3>
          <em>{{ place.description }}</em>
        </h3>
      </b-card>
      <b-card class="mb-2">
        <b-form-group
          label="Your Email*"
          label-for="login-email"
          description="We'll never share your email with anyone else."
        >
          <b-form-input
            id="login-email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
          ></b-form-input>
        </b-form-group>

        <div>
          <input id="storeemail" type="checkbox" name="scales" checked />
          <label for="storeemail">
            Store my email adress to be warned whenever a contact was infected
            by the Covid-19.
          </label>
        </div>
        <br />
        If you stay more than {{ duration }} minutes, please, recheckin.
        <br />
        <br />
        <b-button type="submit" variant="primary">Do a Check-In</b-button>
      </b-card>
    </b-form>
  </div>
  <p v-else-if="state === CheckinState.CHECKMAIL">
    An email has been sent to your mailbox. Please, click on the connection link
    in the mail.
  </p>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Place } from '../../types/Place'
import { showError } from '../../helpers/alerts'

enum CheckinState {
  SCANNING,
  LOADING,
  LOADED,
  ERROR,
  CHECKMAIL,
  FINISH,
}

@Component({})
export default class CheckIn extends Vue {
  state: CheckinState = CheckinState.LOADING
  place: Place | null = null
  duration: string = ''
  email: string = this.$store.getters['session/email']
  error: string = ''
  result: string = ''
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
      showError(
        this.$bvToast,
        'Checkin',
        new Error('A network error occured. Please, try again.')
      )
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

      this.state = CheckinState.FINISH
      this.$router.push({ path: '/' })
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

  onDecode(result: any) {
    this.result = result
    document.location.href = result
  }

  async onInit(promise: any) {
    try {
      await promise
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        this.error = 'ERROR: you need to grant camera access permisson'
      } else if (error.name === 'NotFoundError') {
        this.error = 'ERROR: no camera on this device'
      } else if (error.name === 'NotSupportedError') {
        this.error = 'ERROR: secure context required (HTTPS, localhost)'
      } else if (error.name === 'NotReadableError') {
        this.error = 'ERROR: is the camera already in use?'
      } else if (error.name === 'OverconstrainedError') {
        this.error = 'ERROR: installed cameras are not suitable'
      } else if (error.name === 'StreamApiNotSupportedError') {
        this.error = 'ERROR: Stream API is not supported in this browser'
      }
    }
  }
}
</script>

<style>
.login {
  padding-top: 30px;
}
</style>
