<template>
  <div class="wrapped-container c-center c-medium my-3">
    <p v-if="state === PlaceState.LOADING">
      {{ $t('wait') }}
    </p>
    <div v-else-if="state === PlaceState.LOADED">
      <h2>{{ $t('place') }}</h2>

      <BigActionButton
        v-b-modal.place-creation-modal
        class="mb-3"
        :title="$t('cplace')"
        :subtitle="$t('subtitle')"
        image="place"
      />

      <b-table
        v-if="places.length > 0"
        striped
        bordered
        hover
        head-variant="dark"
        variant="light"
        :fields="fields"
        :items="places"
      >
        <template v-slot:cell(place_name)="data">
          {{ data.item.name }}
        </template>

        <template v-slot:cell(average_duration)="data">
          {{ data.item.averageDuration }} minutes
        </template>

        <template v-slot:cell(qr_code)="data">
          <nuxt-link
            :to="'/' + $i18n.locale + '/organization/places/' + data.item.id"
          >
            {{ $t('showqr') }}
          </nuxt-link>
        </template>
        <template v-slot:cell(actions)="data">
          <b-button
            v-b-modal.place-creation-modal
            variant="outline-secondary"
            class="mb-2"
            @click="
              prepacePlaceFormEdition(
                data.item.id,
                data.item.name,
                data.item.description,
                data.item.averageDuration
              )
            "
          >
            <b-icon icon="pencil"></b-icon>
          </b-button>

          <b-button
            v-b-modal.place-delete-modal
            variant="outline-secondary"
            class="mb-2"
            @click="place = data.item.id"
          >
            <b-icon icon="trash"></b-icon>
          </b-button>
        </template>
      </b-table>
      <p v-else>
        {{ $t('noplace') }}
      </p>

      <b-modal
        id="place-creation-modal"
        :title="$t(placeFormTitle)"
        :ok-title="isPlaceFormEditionMode ? $t('modif') : $t('create')"
        :cancel-title="$t('cancel')"
        @ok="handleModalOk"
        @hidden="prepacePlaceFormCreation"
      >
        <b-form ref="form" @submit.stop.prevent="handlePlaceSubmit">
          <b-form-group :label="$t('name')" label-for="place-name">
            <b-form-input
              id="place-name"
              v-model="placeFormValues.name"
              required
              :placeholder="$t('nom')"
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
              :placeholder="$t('dur')"
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
      </b-modal>

      <b-modal
        id="place-delete-modal"
        :title="$t('sup')"
        ok-variant="danger"
        :ok-title="$t('delete')"
        :cancel-title="$t('cancel')"
        @ok="deletePlace"
      >
        {{ $t('deleteplace') }}
      </b-modal>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "place":"Your Places",
    "wait": "Loading. Please wait...",
    "cplace":"Add a new place open to the public",
    "nex":"This place does not exist.",
    "noplace":"You don't have any places for now. Please, create a place to begin.",
    "showqr":"Show QRCode",
    "name":"Name*",
    "duration":"Average duration of the stay in minutes*",
    "nom":"Nom",
    "modif":"Modify",
    "cancel":"Cancel",
    "create":"Create place",
    "sup":"Delete Place",
    "modifyplace":"Place Modification",
    "deleteplace":"Do you really want to delete this place ?",
    "crea":"Place Creation",
    "pla":"Place Name",
    "dur":"Average Duration",
    "delete":"Delete",
    "qr-code":"QR Code",
    "actions": "Actions",
    "subtitle":"Generate a QR Code for this new place",
    "A network error has occurred. Please, try again.":"A network error has occurred. Please, try again.",
    "Please fill in the required fields.":"Please fill in the required fields.",
    "Place":"Place"
  },
  "fr": {
    "place":"Vos lieux",
    "wait": "Chargement en cours...",
    "nex":"Ce lieu n'existe plus.",
    "cplace":"Ajoutez un nouveau lieu ouvert au public",
    "noplace":"Vous n'avez pas de lieu pour l'instant. Pour commencer, ajoutez un lieu.",
    "showqr":"Afficher QRCode",
    "name":"Nom*",
    "duration":"Durée moyenne de visite en minutes*",
    "nom":"Nom",
    "modif":"Modifier",
    "cancel":"Annuler",
    "create":"Créer",
    "sup":"Supprimer le lieu",
    "modifyplace":"Modification du lieu",
    "deleteplace":"Voulez-vous vraiment supprimer ce lieu ?",
    "crea":"Création du lieu",
    "pla":"Nom du lieu",
    "dur":"Durée moyenne sur place",
    "delete":"Supprimer",
    "qr-code":"QR Code",
    "actions": "Actions",
    "subtitle":"Générez un QR Code pour ce nouveau lieu",
    "A network error has occurred. Please, try again.":"Une erreur réseau s'est produite. Veuillez réessayer.",
    "Please fill in the required fields.":"Veuillez remplir tous les champs requis",
    "Place":"Lieu"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'
import BigActionButton from '~/components/BigActionButton.vue'

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
    BigActionButton,
  },
})
export default class ProfessionalPlaces extends Vue {
  fields = [
    { key: 'place_name', label: this.translate('pla') },
    { key: 'average_duration', label: this.translate('dur') },
    { key: 'qr_code', label: this.translate('qr-code') },
    { key: 'actions', label: this.translate('actions') },
  ]

  places: Place[] = []
  place: string = ''
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
        this.$i18n.t('Place') as string,
        new Error(
          this.$i18n.t(
            'A network error has occurred. Please, try again.'
          ) as string
        )
      )
    }
  }

  resetModal() {
    this.placeFormValues = {
      name: '',
      description: null,
      averageDuration: 30,
    }
    this.place = ''
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
        this.$i18n.t('Place') as string,
        new Error(this.$i18n.t('Please fill in the required fields.') as string)
      )
      return
    }

    try {
      if (this.isPlaceFormEditionMode) {
        await this.$axios.$put(
          '/place/' + this.place,
          this.placeFormValues,
          options
        )
      } else {
        await this.$axios.$post('/place', this.placeFormValues, options)
      }
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('Place') as string,
        new Error(
          this.$i18n.t(
            'A network error has occurred. Please, try again.'
          ) as string
        )
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
      await this.$axios.$delete('/place/' + this.place, {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('Place') as string,
        new Error(
          this.$i18n.t(
            'A network error has occurred. Please, try again.'
          ) as string
        )
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

  prepacePlaceFormEdition(
    id: string,
    name: string,
    description: string,
    averageDuration: number
  ) {
    this.isPlaceFormEditionMode = true
    this.place = id
    this.placeFormValues.name = name
    this.placeFormValues.description = description
    this.placeFormValues.averageDuration = averageDuration
  }

  get placeFormTitle(): string {
    return this.isPlaceFormEditionMode ? 'modifyplace' : 'crea'
  }
}
</script>

<style></style>
