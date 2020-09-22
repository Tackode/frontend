<template>
  <div>
    <div
      v-if="state === PlaceState.LOADING"
      class="wrapped-container c-small my-3"
    >
      <Loader />
    </div>

    <div
      v-else-if="state === PlaceState.LOADED"
      class="wrapped-container c-medium my-3"
    >
      <h2>{{ $t('place') }}</h2>

      <BigActionButton
        v-b-modal.place-creation-modal
        class="mb-3"
        :title="$t('addPlace')"
        :subtitle="$t('subtitle')"
        image="place"
      />

      <div v-if="places.length > 0" class="places-list">
        <CardPlace
          v-for="place in places"
          :key="place.id"
          :place="place"
          @onEdit="onEditPlace"
          @onDelete="onDeletePlace"
        />
      </div>
      <div v-else>
        <div class="card card-content">
          <p>{{ $t('noPlace') }}</p>

          <div class="text-center">
            <img
              class="img-fluid"
              src="~/assets/images/places-empty.png"
              srcset="
              ~/assets/images/places-empty.png    1x,
              ~/assets/images/places-empty@2x.png 2x
              ~/assets/images/places-empty@3x.png 3x
            "
            />
          </div>
        </div>
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

        <template v-slot:modal-footer="{ cancel }">
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
    "place":"Your Places",
    "addPlace":"Add a new place open to the public",
    "noPlace":"You don't have any places for now. You can start by creating one!",
    "nameMandatory":"Name*",
    "duration":"Average duration of the stay in minutes*",
    "name":"Nom",
    "modify":"Modify",
    "cancel":"Cancel",
    "create":"Create place",
    "deletePlace":"Delete Place",
    "modifyPlace":"Place Modification",
    "deletePlaceAsk":"Do you really want to delete this place ?",
    "createPlace":"Place Creation",
    "placeName":"Place Name",
    "durationOnSite":"Average Duration",
    "delete":"Delete",
    "qrCode":"QR Code",
    "actions": "Actions",
    "subtitle":"Generate a QR Code for this new place",
    "networkError":"A network error has occurred. Please, try again.",
    "fillInRequiredFields":"Please fill in the required fields.",
    "placeError":"Place",
    "titlePage":"Covid Journal - My Places"
  },
  "fr": {
    "place":"Vos lieux",
    "addPlace":"Ajoutez un nouveau lieu ouvert au public",
    "noPlace":"Vous n’avez pas de lieu pour l’instant. Vous pouvez en ajouter un dès maintenant !",
    "nameMandatory":"Nom*",
    "duration":"Durée moyenne de visite en minutes*",
    "name":"Nom",
    "modify":"Modifier",
    "cancel":"Annuler",
    "create":"Créer le lieu",
    "deletePlace":"Supprimer le lieu",
    "modifyPlace":"Modification du lieu",
    "deletePlaceAsk":"Voulez-vous vraiment supprimer ce lieu ?",
    "createPlace":"Création du lieu",
    "placeName":"Nom du lieu",
    "durationOnSite":"Durée moyenne sur place",
    "delete":"Supprimer",
    "qrCode":"QR Code",
    "actions": "Actions",
    "subtitle":"Générez un QR Code pour ce nouveau lieu",
    "networkError":"Une erreur réseau s'est produite. Veuillez réessayer.",
    "fillInRequiredFields":"Veuillez remplir tous les champs requis",
    "placeError":"Lieu",
    "titlePage":"Covid Journal - Mes Lieux"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'

enum PlaceState {
  LOADING,
  LOADED,
}

interface PlaceFormValues {
  name: string
  description: string | null
  averageDuration: number
}

@Component({
  components: {
    BigActionButton: () => import('~/components/BigActionButton.vue'),
    CardPlace: () => import('~/components/card-place/CardPlace.vue'),
    Loader: () => import('~/components/Loader.vue'),
  },
})
export default class ProfessionalPlaces extends Vue {
  places: Place[] = []
  placeId: string = ''
  isPlaceFormEditionMode: Boolean = false
  selectedUser: Place | null = null
  state: PlaceState = PlaceState.LOADING
  placeFormValues: PlaceFormValues = {
    name: '',
    description: null,
    averageDuration: 30,
  }

  // Bind enum for Vue
  PlaceState = PlaceState

  mounted() {
    document.title = this.$i18n.t('titlePage') as string
    this.loadData()
    this.state = PlaceState.LOADED
  }

  async loadData() {
    try {
      this.places = await this.$axios.$get('/places', {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
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
    const options = {
      auth: {
        username: this.$store.getters['session/login'],
        password: this.$store.getters['session/token'],
      },
    }

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
        await this.$axios.$put(
          '/place/' + this.placeId,
          this.placeFormValues,
          options
        )
      } else {
        await this.$axios.$post('/place', this.placeFormValues, options)
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
      await this.$axios.$delete('/place/' + this.placeId, {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
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
