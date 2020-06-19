<template>
  <div>
    <h2>Your Profile</h2>
    </br>
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

        <b-form-group
          id="form-organization"
          label="Organization:"
          label-for="form-organization"
        >
          <b-form-input
            id="form-organization"
            v-model="profile.organization.name"
            type="text"
            required
            placeholder="Your orgnaization:"
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
export default class ProfessionalProfile extends Vue {
  profile: Profile | null = null
  saveEmail = false

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
        new Error(
          'A network error occurred while loading the profile. Please, try Again.'
        )
      )
    }

    this.saveEmail = this.profile?.email !== null
  }

  async handleAddEmail(e: Event) {
    e.preventDefault()

    try {
      await this.$axios.$put(
        '/organization',
        {
          name: this.profile?.organization?.name,
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
        'Profil',
        new Error('A network error has occurred in posting. Please, try again.')
      )
    }

    if (this.saveEmail) {
      try {
        await this.$axios.$put(
          '/profile',
          {
            email: this.profile?.email,
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
