<template>
  <div>
    <div
      v-if="state === ProfileState.LOADING"
      class="wrapped-container c-small c-center my-3"
    >
      <Loader />
    </div>

    <div
      v-else-if="state === ProfileState.LOADED"
      class="wrapped-container c-large c-center my-3"
    >
      <DecoratedCard image="profile-drawing" title="">
        <h1>{{ $t('myProfile') }}</h1>

        <b-form @submit="handleAddEmail" class="text-left">
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
              :placeholder="$t('emailPlaceholder')"
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
              :placeholder="$t('emailPlaceholder')"
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
              :placeholder="$t('myOrganization')"
            ></b-form-input>
          </b-form-group>

          <b-form-group>
            <b-form-checkbox
              v-model="saveEmail"
              :value="true"
              :unchecked-value="false"
            >
              {{ $t('storeEmailCheckbox') }}
            </b-form-checkbox>
          </b-form-group>

          <b-button block type="submit" variant="primary">
            {{ $t('submit') }}
          </b-button>
        </b-form>

        <b-button
          v-b-modal.place-delete-modal
          block
          variant="link"
          class="mt-3"
        >
          {{ $t('deleteProfile') }}
        </b-button>
      </DecoratedCard>

      <b-modal
        id="place-delete-modal"
        :title="$t('deleteProfile')"
        ok-variant="danger"
        :ok-title="$t('delete')"
        :cancel-title="$t('cancel')"
        @ok="deleteProfile"
      >
        {{ $t('deleteProfileValidation') }}
      </b-modal>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "myProfile": "My Profile",
    "deleteProfileValidation": "Do you really want to delete your profile?",
    "deleteProfile": "Delete profile",
    "delete": "Delete",
    "cancel": "Cancel",
    "storeEmailCheckbox": "Store my email address to be warned whenever a contact was infected by the Covid-19.",
    "submit": "Submit",
    "myOrganization": "My organization",
    "email": "Email address*",
    "organization": "Organization*",
    "emailPlaceholder": "Your email",
    "successfullyUpdated": "Your profile was successfully updated.",
    "profile": "Profile",
    "networkError": "A network error has occurred in posting. Please, try again.",
    "networkErrorLoading": "A network error occurred while loading the profile. Please, try Again.",
    "profileDeleted": "Your profile has been deleted.",
    "networkErrorDeleting": "A network error has occurred in deleting profile. Please, try again.",
    "titlePage": "My Profile"
  },
  "fr": {
    "myProfile": "Mon Profil",
    "deleteProfileValidation": "Voulez-vous vraiment supprimer votre profil ?",
    "deleteProfile": "Supprimer le profil",
    "delete": "Supprimer",
    "cancel": "Annuler",
    "storeEmailCheckbox": "Je souhaite être notifié par mail si j’ai croisé une personne infectée.",
    "submit": "Valider",
    "myOrganization": "Mon organisation",
    "email": "Adresse mail*",
    "organization": "Entreprise*",
    "emailPlaceholder": "Votre adresse mail",
    "successfullyUpdated": "Votre profil a bien été mis à jour.",
    "profile": "Profil",
    "networkError": "Une erreur réseau est apparue. S'il vous plaît, réessayer.",
    "networkErrorLoading": "Une erreur réseau est apparue pendant le chargement du profil. S'il vous plaît, réessayer.",
    "profileDeleted": "Votre profil a bien été supprimé",
    "networkErrorDeleting": "Une erreur réseau est survenue en supprimant le profil. S'il vous plait réessayer",
    "titlePage": "Mon profil"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { showError, showSuccess } from '../../helpers/alerts'
import { Profile } from '../../types/Profile'

enum ProfileState {
  LOADING,
  LOADED,
}

@Component({
  components: {
    DecoratedCard: () => import('~/components/DecoratedCard.vue'),
    Loader: () => import('~/components/Loader.vue'),
  },
  head(this: ProfilePage) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
})
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
        this.$i18n.t('profile') as string,
        new Error(this.$i18n.t('networkErrorLoading') as string)
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
          this.$i18n.t('profile') as string,
          new Error(this.$i18n.t('networkError') as string)
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
        this.$i18n.t('profile') as string,
        this.$i18n.t('successfullyUpdated') as string
      )
    } catch (error) {
      showError(
        this.$bvToast,
        'Profile',
        new Error(this.$i18n.t('networkError') as string)
      )
    }
  }

  async deleteProfile() {
    this.$bvModal.hide('place-delete-modal')

    try {
      await this.$axios.$delete('/profile', {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('profile') as string,
        new Error(this.$i18n.t('networkErrorDeleting') as string)
      )
      return
    }

    showSuccess(
      this.$bvToast,
      this.$i18n.t('profile') as string,
      this.$i18n.t('profileDeleted') as string
    )

    this.$store.dispatch('session/logout')
    this.$router.replace('/' + this.$i18n.locale)
  }
}
</script>
