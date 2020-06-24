<template>
  <p v-if="state === ProfileState.LOADING">{{ $t('wait') }}</p>
  <div v-else-if="state === ProfileState.LOADED">
    <h2>{{ $t('pro') }}</h2>
    <br />
    <b-card tag="article" style="max-width: 40rem;" class="mb-2">
      <b-form v-if="profile" @submit="handleAddEmail">
        <b-form-group
          id="form-email"
          :label="$t('email')"
          label-for="form-email"
        >
          <b-form-input
            id="form-email"
            v-model="email"
            type="email"
            readonly
            :placeholder="$t('emai')"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="form-organization"
          :label="$t('or')"
          label-for="form-organization"
        >
          <b-form-input
            id="form-organization"
            v-model="profile.organization.name"
            type="text"
            required
            :placeholder="$t('org')"
          ></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox
            v-model="saveEmail"
            :value="true"
            :unchecked-value="false"
          >
            {{ $t('store') }}
          </b-form-checkbox>
        </b-form-group>

        <b-button type="submit" variant="primary"> {{ $t('sub') }} </b-button>
      </b-form>
    </b-card>

    <b-card tag="article" style="max-width: 40rem;" class="mb-2">
      <b-button v-b-modal.place-delete-modal variant="secondary">
        {{ $t('sup') }}
      </b-button>
    </b-card>
    <b-modal id="place-delete-modal" :title="$t('sup')">
      <b-form @submit="deleteProfile">
        {{ $t('del') }}
        <br />
        <br />
        <b-button type="submit" variant="success"> {{ $t('yes') }} </b-button>
        <b-button variant="danger" @click="$bvModal.hide('place-delete-modal')">
          {{ $t('no') }}
        </b-button>
      </b-form>
      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>
  </div>
</template>

<i18n>
{
  "en": {
    "wait":"Loading. Please wait...",
    "pro":"My Profile",
    "del":"Do you really want to delete your profile?",
    "sup":"Delete profile",
    "yes":"Yes",
    "no":"No",
    "store":"Store my email address to be warned whenever a contact was infected by the Covid-19.",
    "sub":"Submit",
    "org":"Your organization",
    "email":"Email address*",
    "or":"Organization*",
    "emai":"Your email"
  },
  "fr": {
    "wait":"Chargement en cours...",
    "pro":"Mon Profil",
    "del":"Voulez-vous vraiment supprimer votre profil ?",
    "sup":"Supprimer le profil",
    "yes":"Oui",
    "no":"Non",
    "store":"Conserver mon adresse email pour être informé si un contact est infecté par le Covid.",
    "sub":"Valider",
    "org":"Votre entreprise",
    "email":"Adresse mail*",
    "or":"Entreprise*",
    "emai":"Votre adresse mail"
  }
}
</i18n>

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
export default class ProfessionalProfile extends Vue {
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
        new Error(
          'A network error occurred while loading the profile. Please, try Again.'
        )
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
      this.emai = this.email
    } else {
      this.emai = null
    }

    try {
      await this.$axios.$put(
        '/profile',
        {
          email: this.emai,
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
        'Profile',
        new Error('A network error has occurred in posting. Please, try again.')
      )
    }
  }

  async deleteProfile(e: Event) {
    e.preventDefault()
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
</script>

<style></style>
