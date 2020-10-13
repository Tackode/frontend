<template>
  <div>
    <div class="wrapped-container c-large c-center my-3">
      <DecoratedCard image="profile-drawing" title="">
        <h1 class="text-center">{{ $t('myProfile') }}</h1>

        <b-form @submit="handleSubmit">
          <b-form-group
            id="form-email"
            :label="$t('email')"
            label-for="form-email"
          >
            <b-form-input
              id="form-email"
              v-model="profile.email"
              type="email"
              readonly
              :placeholder="$t('emailPlaceholder')"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            v-if="profile.role === 'Professional'"
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

          <b-button
            v-if="profile.role === 'Professional'"
            block
            type="submit"
            variant="primary"
          >
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

@Component({
  middleware: ['auth-user'],
  components: {
    DecoratedCard: () => import('~/components/DecoratedCard.vue'),
  },
  head(this: ProfilePage) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
  async asyncData({ $axios }) {
    return {
      profile: await $axios.$get<Profile>('/profile'),
    }
  },
})
export default class ProfilePage extends Vue {
  profile: Profile | null = null

  async handleSubmit(e: Event) {
    e.preventDefault()

    if (this.profile?.role === 'Professional') {
      try {
        await this.$axios.$put<void>('/organization', {
          name: this.profile?.organization?.name,
        })
      } catch (error) {
        showError(
          this.$bvToast,
          this.$i18n.t('profile') as string,
          new Error(this.$i18n.t('networkError') as string)
        )
        return
      }

      showSuccess(
        this.$bvToast,
        this.$i18n.t('profile') as string,
        this.$i18n.t('successfullyUpdated') as string
      )
    }
  }

  async deleteProfile() {
    this.$bvModal.hide('place-delete-modal')

    try {
      await this.$axios.$delete<void>('/profile')
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

    this.$store.commit('session/logout')
    this.$router.replace(this.localePath('/'))
  }
}
</script>
