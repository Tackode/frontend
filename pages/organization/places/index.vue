<template>
  <div>
    <div class="wrapped-container c-medium my-3">
      <h2 class="text-center">{{ $t('place') }}</h2>

      <BigActionButton
        v-b-modal.place-creation-modal
        class="mb-3"
        :title="$t('addPlace')"
        :subtitle="$t('subtitle')"
        image="place"
      />

      <div v-if="places.length > 0" class="places-list">
        <CardMode
          v-for="place in places"
          :mode="Mode.PLACE"
          :key="place.id"
          :place="place"
          @onEdit="onEditPlace"
          @onDelete="onDeletePlace"
        />
      </div>
      <div v-else>
        <EmptyCard :empty-text="$t('noPlace')"></EmptyCard>
      </div>

      <b-modal
        id="place-creation-modal"
        :title="$t(placeFormTitle)"
        @hidden="prepacePlaceFormCreation"
      >
        <b-form ref="form" @submit.stop.prevent="handlePlaceSubmit">
          <b-form-group :label="$t('nameMandatory')" label-for="place-name">
            <b-form-input
              id="place-name"
              v-model="placeFormValues.name"
              required
              :placeholder="$t('name')"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :label="$t('duration')"
            label-for="place-average-duration"
          >
            <b-form-input
              id="place-average-duration"
              v-model="placeFormValues.averageDuration"
              number
              required
              :placeholder="$t('durationOnSite')"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Description" label-for="place-description">
            <b-form-textarea
              id="place-description"
              v-model="placeFormValues.description"
              placeholder="Description"
              rows="8"
            ></b-form-textarea>
          </b-form-group>
        </b-form>

        <template #modal-footer="{ cancel }">
          <div class="w-100">
            <div class="float-left">
              <b-button variant="secondary" @click="cancel()">
                {{ $t('cancel') }}
              </b-button>
            </div>
            <b-button
              variant="primary"
              class="float-right"
              @click="handleModalOk"
            >
              {{ isPlaceFormEditionMode ? $t('modify') : $t('create') }}
            </b-button>
          </div>
        </template>
      </b-modal>

      <b-modal
        id="place-delete-modal"
        :title="$t('deletePlace')"
        ok-variant="danger"
        :ok-title="$t('delete')"
        :cancel-title="$t('cancel')"
        @ok="deletePlace"
      >
        {{ $t('deletePlaceAsk') }}
      </b-modal>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "place": "Your Places",
    "addPlace": "Add a new place open to the public",
    "noPlace": "You don't have any places for now. You can start by creating one!",
    "nameMandatory": "Name*",
    "duration": "Average duration of the stay in minutes*",
    "name": "Nom",
    "modify": "Modify",
    "cancel": "Cancel",
    "create": "Create place",
    "deletePlace": "Delete Place",
    "modifyPlace": "Place Modification",
    "deletePlaceAsk": "Do you really want to delete this place ?",
    "createPlace": "Place Creation",
    "placeName": "Place Name",
    "durationOnSite": "Average Duration",
    "delete": "Delete",
    "qrCode": "QR Code",
    "actions": "Actions",
    "subtitle": "Generate a QR Code for this new place",
    "networkError": "A network error has occurred. Please, try again.",
    "fillInRequiredFields": "Please fill in the required fields.",
    "placeError": "Place",
    "titlePage": "My Places"
  },
  "fr": {
    "place": "Vos lieux",
    "addPlace": "Ajoutez un nouveau lieu ouvert au public",
    "noPlace": "Vous n’avez pas de lieu pour l’instant. Vous pouvez en ajouter un dès maintenant !",
    "nameMandatory": "Nom*",
    "duration": "Durée moyenne de visite en minutes*",
    "name": "Nom",
    "modify": "Modifier",
    "cancel": "Annuler",
    "create": "Créer le lieu",
    "deletePlace": "Supprimer le lieu",
    "modifyPlace": "Modification du lieu",
    "deletePlaceAsk": "Voulez-vous vraiment supprimer ce lieu ?",
    "createPlace": "Création du lieu",
    "placeName": "Nom du lieu",
    "durationOnSite": "Durée moyenne sur place",
    "delete": "Supprimer",
    "qrCode": "QR Code",
    "actions": "Actions",
    "subtitle": "Générez un QR Code pour ce nouveau lieu",
    "networkError": "Une erreur réseau s'est produite. Veuillez réessayer.",
    "fillInRequiredFields": "Veuillez remplir tous les champs requis",
    "placeError": "Lieu",
    "titlePage": "Mes lieux"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'
import { Mode } from '~/types/CardMode'

interface PlaceFormValues {
  name: string
  description: string | null
  averageDuration: number
}

@Component({
  middleware: ['auth-professional'],
  components: {
    BigActionButton: () => import('~/components/BigActionButton.vue'),
    CardMode: () => import('~/components/CardMode.vue'),
    EmptyCard: () => import('~/components/EmptyCard.vue'),
  },
  head(this: ProfessionalPlaces) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
  async asyncData({ $axios }) {
    return {
      places: await $axios.$get<Place[]>('/places'),
    }
  },
})
export default class ProfessionalPlaces extends Vue {
  places: Place[] = []
  placeId: string = ''
  isPlaceFormEditionMode: Boolean = false
  placeFormValues: PlaceFormValues = {
    name: '',
    description: null,
    averageDuration: 30,
  }

  Mode = Mode

  async loadData() {
    try {
      this.places = await this.$axios.$get<Place[]>('/places')
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('placeError') as string,
        new Error(this.$i18n.t('networkError') as string)
      )
    }
  }

  resetModal() {
    this.placeFormValues = {
      name: '',
      description: null,
      averageDuration: 30,
    }
    this.placeId = ''
  }

  async handleModalOk(e: Event) {
    e.preventDefault()
    await this.handlePlaceSubmit()
  }

  async handlePlaceSubmit() {
    if (
      this.placeFormValues.name === '' ||
      this.placeFormValues.averageDuration <= 0
    ) {
      showError(
        this.$bvToast,
        this.$i18n.t('placeError') as string,
        new Error(this.$i18n.t('fillInRequiredFields') as string)
      )
      return
    }

    try {
      if (this.isPlaceFormEditionMode) {
        await this.$axios.$put<Place>(
          `/place/${this.placeId}`,
          this.placeFormValues
        )
      } else {
        await this.$axios.$post<Place>('/place', this.placeFormValues)
      }
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('placeError') as string,
        new Error(this.$i18n.t('networkError') as string)
      )
      return
    }

    this.$nextTick(() => {
      this.$bvModal.hide('place-creation-modal')
    })

    this.loadData()
  }

  async deletePlace(e: Event) {
    e.preventDefault()
    try {
      await this.$axios.$delete<void>('/place/' + this.placeId)
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('placeError') as string,
        new Error(this.$i18n.t('networkError') as string)
      )
      return
    }

    this.$bvModal.hide('place-delete-modal')

    this.loadData()
  }

  translate(index: string) {
    return this.$i18n.t(index)
  }

  prepacePlaceFormCreation() {
    this.isPlaceFormEditionMode = false
    this.resetModal()
  }

  onEditPlace(place: Place) {
    this.isPlaceFormEditionMode = true
    this.placeId = place.id
    this.placeFormValues.name = place.name
    this.placeFormValues.description = place.description
    this.placeFormValues.averageDuration = place.averageDuration

    this.$bvModal.show('place-creation-modal')
  }

  onDeletePlace(place: Place) {
    this.placeId = place.id
    this.$bvModal.show('place-delete-modal')
  }

  get placeFormTitle(): string {
    return this.isPlaceFormEditionMode ? 'modifyPlace' : 'createPlace'
  }
}
</script>
