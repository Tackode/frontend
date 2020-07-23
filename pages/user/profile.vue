<template>
  <div class="wrapped-container c-small c-center my-3">
    <p v-if="state === ProfileState.LOADING">{{ $t('wait') }}</p>
    <template v-else-if="state === ProfileState.LOADED">
      <h2>{{ $t('my-profile') }}</h2>
      <div v-if="profile">
        <b-form @submit="handleAddEmail">
          <b-form-group
            v-if="$store.getters['session/localEmail'] !== null"
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
            v-else
            id="form-email"
            :label="$t('email')"
            label-for="form-email"
          >
            <b-form-input
              id="form-email"
              v-model="email"
              type="email"
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

          <b-button block type="submit" variant="primary">
            {{ $t('submit') }}
          </b-button>
        </b-form>

        <hr />

        <b-button v-b-modal.place-delete-modal block variant="secondary">
          {{ $t('delete-profile') }}
        </b-button>
      </div>
      <b v-else>{{ $t('charge') }}</b>
      <b-modal
        id="place-delete-modal"
        :title="$t('delete-profile')"
        ok-variant="danger"
        :ok-title="$t('delete')"
        :cancel-title="$t('cancel')"
        @ok="deleteProfile"
      >
        {{ $t('delete-profile-validation') }}
      </b-modal>
    </template>
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
    "delete": "Delete",
    "cancel": "Cancel",
    "store-email-checkbox": "Store my email address to be warned whenever a contact was infected by the Covid-19.",
    "submit": "Submit",
    "my-organization": "My organization",
    "email": "Email address*",
    "organization": "Organization*",
    "email-placeholder": "Your email",
    "successfully_updated":"Your profile was successfully updated.",
    "Profile":"Profile",
    "A network error has occurred in posting. Please, try again.":"A network error has occurred in posting. Please, try again.",
    "A network error occurred while loading the profile. Please, try Again.":"A network error occurred while loading the profile. Please, try Again.",
    "Your profile has been deleted.":"Your profile has been deleted.",
    "Network error in deleting profile.":"A network error has occurred in deleting profile. Please, try again."
  },
  "fr": {
    "charge":"Chargement impossible. Profil Introuvable.",
    "wait": "Chargement en cours...",
    "my-profile": "Mon Profil",
    "delete-profile-validation": "Voulez-vous vraiment supprimer votre profil ?",
    "delete-profile": "Supprimer le profil",
    "delete": "Supprimer",
    "cancel": "Annuler",
    "store-email-checkbox": "Conserver mon adresse email pour être informé si un contact est infecté par le Covid.",
    "submit": "Valider",
    "my-organization": "Mon organisation",
    "email": "Adresse mail*",
    "organization": "Entreprise*",
    "email-placeholder": "Votre adresse mail",
    "successfully_updated":"Votre profil a bien été mis à jour.",
    "Profile":"Profil",
    "A network error has occurred in posting. Please, try again.":"Une erreur réseau est apparue. S'il vous plaît, réessayer.",
    "A network error occurred while loading the profile. Please, try Again.":"Une erreur réseau est apparue pendant le chargement du profil. S'il vous plaît, réessayer.",
    "Your profile has been deleted.":"Votre profil a bien été supprimé",
    "Network error in deleting profile.":"Une erreur réseau est survenue en supprimant le profil. S'il vous plait réessayer"
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

  // Bind enum for Vue
  ProfileState = ProfileState

  async mounted() {
    if (
      !this.$store.getters['session/localEmail'] &&
      this.$store.getters['session/email']
    ) {
      this.email = this.$store.getters['session/email']
      this.$store.dispatch('session/sendLocalEmail', this.email)
    }
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
        this.$i18n.t('Profile') as string,
        new Error(
          this.$i18n.t(
            'A network error occurred while loading the profile. Please, try Again.'
          ) as string
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
          this.$i18n.t('Profile') as string,
          new Error(
            this.$i18n.t(
              'A network error has occurred in posting. Please, try again.'
            ) as string
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
        this.$i18n.t('Profile') as string,
        this.$i18n.t('successfully_updated') as string
      )
    } catch (error) {
      showError(
        this.$bvToast,
        'Profile',
        new Error('A network error has occurred in posting. Please, try again.')
      )
    }
  }

  async deleteProfile() {
    try {
      await this.$axios.$delete('/profile', {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
      this.$bvModal.hide('place-delete-modal')
      this.$store.dispatch('session/logout')
      this.$router.replace('/' + this.$i18n.locale)
      showSuccess(
        this.$bvToast,
        this.$i18n.t('Profile') as string,
        this.$i18n.t('Your profile has been deleted.') as string
      )
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('Profile') as string,
        new Error(this.$i18n.t('Network error in deleting profile.') as string)
      )
    }
  }
}
</script>

<style></style>
