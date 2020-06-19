<template>
  <div>
    <b-card tag="article" style="max-width: 40rem;" class="mb-2">
      <b-form v-if="profile" @submit="handleAddEmail">
        <b-form-group
          id="form-email"
          label="Email address:"
          label-for="form-email"
        >
          <b-form-input
            id="form-email"
            v-model="profile.email"
            type="email"
            readonly
            placeholder="Your email:"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../../helpers/alerts'
import { Profile } from '../../../types/Profile'

@Component({})
export default class GuestProfile extends Vue {
  profile: Profile | null = null
  saveEmail = false

  async mounted() {
    try {
      this.profile = await this.$axios.$get('/profile', {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token']
        }
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Profil',
        new Error('A network error has occurred. Please, try again.')
      )
    }

    this.saveEmail = this.profile?.email !== null
  }

  async handleAddEmail(e: Event) {
    e.preventDefault()
    if (this.saveEmail) {
      try {
        await this.$axios.$put(
          '/profile',
          {
            email: this.profile?.email
          },
          {
            auth: {
              username: this.$store.getters['session/login'],
              password: this.$store.getters['session/token']
            }
          }
        )
      } catch (error) {
        showError(
          this.$bvToast,
          'Profil',
          new Error(
            'A network error has occurred in posting. Please, try again.'
          )
        )
      }
    }
  }
}
</script>

<style></style>
