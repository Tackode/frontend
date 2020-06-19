<template>
  <div v-if="state === CheckinState.SCANNING">
    <h2>Scan a QR Code</h2>
    <br />Scanning
  </div>
  <p v-else-if="state === CheckinState.LOADING">Loading. Please wait...</p>
  <b-form v-else-if="state === CheckinState.LOADED" @submit="handleSubmit">
    <b-card v-if="place" title="Place" class="mb-4">
      <b-form-group label="Organization:" label-for="organization-name">
        <b-form-input
          id="organization-name"
          v-model="place.organization.name"
          readonly
          placeholder="Organization name"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Place name:" label-for="place-name">
        <b-form-input
          id="place-name"
          v-model="place.name"
          readonly
          placeholder="Enter your place name"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Description:" label-for="description-name">
        <b-form-input
          id="description-name"
          v-model="place.description"
          readonly
          placeholder="Enter description"
        ></b-form-input>
      </b-form-group>
    </b-card>
    <b-card class="mb-2">
      <b-form-group label="Check-In Time:" label-for="check-in-time">
        <b-form-input
          id="check-in-time"
          placeholder="Enter Check-In Time"
          type="Date"
          :value="new Date()"
          readonly
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Time Spent in Place:" label-for="spent-in-place">
        <b-form-input
          id="spent-in-place"
          v-model="duration"
          type="number"
          required
          placeholder="Enter Time Spent in Place"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        label="Your Email:"
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
          Store my email adress to be warned whenever a contact was infected by
          the Covid-19.
        </label>
      </div>

      <b-button type="submit" variant="primary">Do a Check-In</b-button>
    </b-card>
  </b-form>
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
  storeEmail = true

  CheckinState = CheckinState

  async mounted() {
    const placeId = this.$route.query.placeId

    if (!placeId) {
      this.state = CheckinState.SCANNING
      // showError(
      //  this.$bvToast,
      //  'Checkin',
      //  new Error('A parameter is missing. Please, flash a valid qr-code.')
      // )
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
}
</script>

<style>
.login {
  padding-top: 30px;
}
</style>
