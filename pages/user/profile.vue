<template>
  <p v-if="state === ProfileState.LOADING">{{ $t('wait') }}</p>
  <div
    v-else-if="state === ProfileState.LOADED"
    class="wrapped-container center-div container medium-container"
  >
    <h2 class="subtitle">{{ $t('my-profile') }}</h2>
    <b-card
      v-if="profile"
      tag="article"
      style="max-width: 40rem;"
      class="mb-2 no-border"
    >
      <b-form @submit="handleAddEmail">
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
            :placeholder="$t('email-placeholder')"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          v-if="role === 'Professional'"
          id="form-organization"
          :label="$t('organization')"
          label-for="form-organization"
        >
          <b-form-input
            id="form-organization"
            v-model="profile.organization.name"
            type="text"
            required
            :placeholder="$t('my-organization')"
          ></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox
            v-model="saveEmail"
            :value="true"
            :unchecked-value="false"
          >
            {{ $t('store-email-checkbox') }}
          </b-form-checkbox>
        </b-form-group>

        <b-button block class="button--blue" type="submit" variant="primary">
          {{ $t('submit') }}
        </b-button>
      </b-form>

      <hr
        v-if="profile"
        style="
          height: 0.5px;
          color: grey;
          background-color: grey;
          width: 60%;
          border: none;
          margin-left: auto;
          margin-right: auto;
        "
      />

      <b-button v-b-modal.place-delete-modal block variant="secondary">
        {{ $t('delete-profile') }}
      </b-button>
    </b-card>
    <b v-else>{{ $t('charge') }}</b>
    <b-modal id="place-delete-modal" :title="$t('delete-profile')">
      <b-form @submit="deleteProfile">
        {{ $t('delete-profile-validation') }}
        <br />
        <br />
        <b-button type="submit" variant="success">{{ $t('yes') }}</b-button>
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
    "charge":"Loading impossible. Cannot find your profile",
    "wait": "Loading. Please wait...",
    "my-profile": "My Profile",
    "delete-profile-validation": "Do you really want to delete your profile?",
    "delete-profile": "Delete profile",
    "yes": "Yes",
    "no": "No",
    "store-email-checkbox": "Store my email address to be warned whenever a contact was infected by the Covid-19.",
    "submit": "Submit",
    "my-organization": "My organization",
    "email": "Email address*",
    "organization": "Organization*",
    "email-placeholder": "Your email"
  },
  "fr": {
    "charge":"Chargement impossible. Profil Introuvable.",
    "wait": "Chargement en cours...",
    "my-profile": "Mon Profil",
    "delete-profile-validation": "Voulez-vous vraiment supprimer votre profil ?",
    "delete-profile": "Supprimer le profil",
    "yes": "Oui",
    "no": "Non",
    "store-email-checkbox": "Conserver mon adresse email pour être informé si un contact est infecté par le Covid.",
    "submit": "Valider",
    "my-organization": "Mon organisation",
    "email": "Adresse mail*",
    "organization": "Entreprise*",
    "email-placeholder": "Votre adresse mail"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError, showSuccess } from '../../helpers/alerts'
import { Profile } from '../../types/Profile'

enum ProfileState {
  LOADING,
  LOADED,
}

@Component({})
export default class ProfilePage extends Vue {
  state: ProfileState = ProfileState.LOADING
  role: string | null = null
  profile: Profile | null = null
  saveEmail = false
  email: string = this.$store.getters['session/localEmail']
  ProfileState = ProfileState

  async mounted() {
    this.role = this.$store.getters['session/role']

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
    this.state = ProfileState.LOADED
  }

  async handleAddEmail(e: Event) {
    e.preventDefault()

    if (this.role === 'Professional') {
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
          new Error(
            'A network error has occurred in posting. Please, try again.'
          )
        )
      }
    }

    try {
      await this.$axios.$put(
        '/profile',
        {
          email: this.saveEmail ? this.email : null,
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
