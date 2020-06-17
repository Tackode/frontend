<template>
  <p v-if="state === CheckinState.LOADING">
    Loading. Please wait...
  </p>
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
        <label for="storeemail"
          >Store my email adress to be warned whenever a contact was infected by
          the Covid-19.</label
        >
      </div>

      <b-button type="submit" variant="primary">Do a Check-In</b-button>
    </b-card>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Place } from '../../types/Place'
import { showError } from '../../helpers/alerts'

enum CheckinState {
  LOADING,
  LOADED,
  ERROR,
  FINISH
}

@Component({})
export default class CheckIn extends Vue {
  state: CheckinState = CheckinState.LOADING
  place: Place | null = null
  duration: string = ''
  email: string = ''
  storeEmail = true

  CheckinState = CheckinState

  async mounted() {
    const placeId = this.$route.query.placeId

    if (!placeId) {
      showError(
        this.$bvToast,
        'Checkin',
        new Error('A parameter is missing. Please, flash a valid qr-code.')
      )
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

    try {
      await this.$axios.$post('/checkin', {
        placeId: this.place.id,
        email: this.email,
        storeEmail: this.storeEmail,
        duration: parseInt(this.duration)
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Checkin',
        new Error('A network error occured. Please, try again.')
      )
      return
    }

    this.state = CheckinState.FINISH
  }
}
</script>

<style>
.login {
  padding-top: 30px;
}
</style>
