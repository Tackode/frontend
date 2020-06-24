<template>
  <p v-if="state === ProfileState.LOADING">Loading. Please wait...</p>
  <div v-else-if="state === ProfileState.LOADED">
    <h2>Your Profile</h2>
    <br />
    <b-card tag="article" style="max-width: 40rem;" class="mb-2">
      <b-form v-if="profile" @submit="handleAddEmail">
        <b-form-group
          id="form-email"
          label="Email address *"
          label-for="form-email"
        >
          <b-form-input
            id="form-email"
            v-model="email"
            type="email"
            readonly
            placeholder="Your email"
          ></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox
            v-model="saveEmail"
            :value="true"
            :unchecked-value="false"
            >Store my email address to be warned whenever a contact was infected
            by the Covid-19.</b-form-checkbox
          >
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-card>

    <b-card tag="article" style="max-width: 40rem;" class="mb-2">
      <b-button v-b-modal.place-delete-modal variant="secondary"
        >Delete profile</b-button
      >
    </b-card>
    <b-modal id="place-delete-modal" title="Delete Profile">
      <b-form @submit="deleteProfile">
        Do you really want to delete your profile?
        <br />
        <br />
        <b-button type="submit" variant="success">Yes</b-button>
        <b-button variant="danger" @click="$bvModal.hide('place-delete-modal')"
          >No</b-button
        >
      </b-form>
      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError, showSuccess } from '../../../helpers/alerts'
import { Profile } from '../../../types/Profile'

enum ProfileState {
  LOADING,
  LOADED,
}

@Component({})
export default class GuestProfile extends Vue {
  state: ProfileState = ProfileState.LOADING
  profile: Profile | null = null
  saveEmail = false
  email: string | undefined | null = null
  emai: string | undefined | null = null
  ProfileState = ProfileState
  async mounted() {
    try {
      this.profile = await this.$axios.$get('/profile', {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Profil',
        new Error('A network error has occurred. Please, try again.')
      )
    }

    this.saveEmail = this.profile?.email !== null
    if (this.$store.getters['session/email']) {
      this.email = this.$store.getters['session/email']
    } else {
      this.email = localStorage.emai
    }
    this.state = ProfileState.LOADED
  }

  async handleAddEmail(e: Event) {
    e.preventDefault()
    if (this.saveEmail) {
      this.emai = this.email
    } else {
      this.emai = null
    }

    try {
      await this.$axios.$put(
        '/profile',
        {
          email: this.email,
        },
        {
          auth: {
            username: this.$store.getters['session/login'],
            password: this.$store.getters['session/token'],
          },
        }
      )
      showSuccess(
        this.$bvToast,
        'Profile',
        'Your profile was successfully updated.'
      )
    } catch (error) {
      showError(
        this.$bvToast,
        'Profil',
        new Error('A network error has occurred in posting. Please, try again.')
      )
    }

    if (this.saveEmail === false) {
      if (this.$store.getters['session/email']) {
        this.email = this.$store.getters['session/email']
      } else {
        this.email = localStorage.emai
      }
    }
  }

  async deleteProfile(e: Event) {
    e.preventDefault()
    if (this.saveEmail) {
      try {
        await this.$axios.$delete('/profile', {
          auth: {
            username: this.$store.getters['session/login'],
            password: this.$store.getters['session/token'],
          },
        })
        this.$bvModal.hide('place-delete-modal')
        this.$store.dispatch('session/logout')
        showSuccess(this.$bvToast, 'Profile', 'Your profile has been deleted.')
      } catch (error) {
        showError(
          this.$bvToast,
          'Profile',
          new Error(
            'A network error has occurred in deleting profile. Please, try again.'
          )
        )
      }
    }
  }
}
</script>

<style></style>
