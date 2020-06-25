<template>
  <div>
    <h1 class="sr-only">Places</h1>
    <h2>{{ $t('place') }}</h2>
    <br />

    <b-button
      v-b-modal.place-creation-modal
      variant="primary"
      @click="PlacetoCreate()"
      class="mb-2"
    >
      {{ $t('cplace') }}
    </b-button>
    <br />
    <br />
    <b-table
      v-if="places.length > 0"
      striped
      hover
      :fields="fields"
      :items="places"
    >
      <template v-slot:cell(place_name)="data">
        {{ data.item.name }}
      </template>

      <template v-slot:cell(average_duration)="data">
        {{ data.item.averageDuration }} minutes
      </template>

      <template v-slot:cell(action)="data">
        <nuxt-link :to="'/professional/places/' + data.item.id">
          {{ $t('aff') }}
        </nuxt-link>
      </template>
      <template v-slot:cell(modify)="data">
        <b-button
          v-b-modal.place-creation-modal
          @click="
            PlacetoModify(
              data.item.id,
              data.item.name,
              data.item.description,
              data.item.averageDuration
            )
          "
          variant="outline-secondary"
          class="mb-2"
        >
          <b-icon icon="pencil"></b-icon>
        </b-button>
      </template>

      <template v-slot:cell(delete)="data">
        <b-button
          v-b-modal.place-delete-modal
          @click="place = data.item.id"
          variant="outline-secondary"
          class="mb-2"
        >
          <b-icon icon="trash"></b-icon>
        </b-button>
      </template>
    </b-table>
    <p v-else>
      {{ $t('noplace') }}
    </p>

    <b-modal id="place-creation-modal" :title="$t(FormTitle())">
      <b-form @submit="handleplaceFormValuesSubmit">
        <b-form-group :label="$t('name')" label-for="place-name">
          <b-form-input
            id="place-name"
            v-model="placeFormValues.name"
            required
            :placeholder="$t('na')"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Description*" label-for="place-description">
          <b-form-input
            id="place-description"
            v-model="placeFormValues.description"
            required
            placeholder="Description"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('duration')"
          label-for="place-average-duration"
        >
          <b-form-input
            id="place-average-duration"
            v-model="placeFormValues.averageDuration"
            required
            :placeholder="$t('dur')"
          ></b-form-input>
        </b-form-group>
        <b-button v-if="placeFormMode" type="submit" variant="primary">
          {{ $t('mod') }}
        </b-button>
        <b-button v-else type="submit" variant="primary">
          {{ $t('creer') }}
        </b-button>
      </b-form>

      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>

    <b-modal id="place-delete-modal" :title="$t('sup')">
      <b-form @submit="handleplaceFormValuesDelete">
        {{ $t('del') }}
        <br />
        <br />
        <b-button type="submit" variant="success">Yes</b-button>
        <b-button variant="danger" @click="$bvModal.hide('place-delete-modal')"
          >No</b-button
        >
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
    "place":"Your Places",
    "cplace":"Create a place",
    "noplace":"You don't have any places for now. Please, create a place to begin.",
    "aff":"Show QRCode",
    "name":"Name*",
    "duration":"Average duration of the stay in minutes*",
    "dur":"Average Duration in minutes",
    "na":"Nom",
    "mod":"Modify",
    "creer":"Create place",
    "del":"Do you really want to delete the place?",
    "sup":"Delete Place",
    "mod":"Place Modification",
    "crea":"Place Creation"

  },
  "fr": {
    "place":"Vos Adresses",
    "cplace":"Ajouter un lieu",
    "noplace":"Vous n'avez pas de lieu pour l'instant. Pour commencer, ajoutez un lieu.",
    "aff":"Afficher QRCode",
    "name":"Nom*",
    "duration":"Durée moyenne de visite en minutes*",
    "dur":"Durée moyenne en minutes",
    "na":"Nom",
    "mod":"Modifier",
    "creer":"Créer le lieu",
    "del":"Voulez vous vraiment supprimer le lieu ?",
    "sup":"Supprimer le lieu",
    "mod":"Modification du lieu",
    "crea":"Création du lieu"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { BootstrapVueIcons } from 'bootstrap-vue'
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'

Vue.use(BootstrapVueIcons)
interface PlaceFormValues {
  name: string
  description: string | null
  averageDuration: string
}

@Component
export default class ProfessionalPlaces extends Vue {
  fields = [
    { key: 'place_name', label: 'Place Name' },
    { key: 'average_duration', label: 'Average Duration' },
    { key: 'action', label: 'Action' },
    { key: 'modify', label: 'Modify' },
    { key: 'delete', label: 'Delete' },
  ]

  places: Place[] = []
  place: string = ''
  placeFormMode: Boolean = false
  selectedUser: Place | null = null
  placeFormValues: PlaceFormValues = {
    name: '',
    description: null,
    averageDuration: '',
  }

  mounted() {
    this.loadData()
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
        'Connexion',
        new Error("Une erreur réseau s'est produite. Veuillez réessayer.")
      )
    }
  }

  async handleplaceFormValuesSubmit(e: Event) {
    e.preventDefault()
    if (this.placeFormMode) {
      try {
        await this.$axios.$put(
          '/place/' + this.place,
          {
            name: this.placeFormValues.name,
            description: this.placeFormValues.description,
            averageDuration: parseInt(this.placeFormValues.averageDuration),
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
          'Connexion',
          new Error('A network error has occurred. Please, try again.')
        )
        return
      }
    } else {
      try {
        await this.$axios.$post(
          '/place',
          {
            name: this.placeFormValues.name,
            description: this.placeFormValues.description,
            averageDuration: parseInt(this.placeFormValues.averageDuration),
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
          'Connexion',
          new Error('A network error has occurred. Please, try again.')
        )
        return
      }
    }
    this.$bvModal.hide('place-creation-modal')

    this.loadData()
  }

  async handleplaceFormValuesDelete(e: Event) {
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
        'Connexion',
        new Error('A network error has occurred. Please, try again.')
      )
      return
    }

    this.$bvModal.hide('place-delete-modal')

    this.loadData()
  }

  PlacetoModify(
    id: string,
    name: string,
    description: string,
    averageDuration: string
  ) {
    this.placeFormMode = true
    this.place = id
    this.placeFormValues.name = name
    this.placeFormValues.description = description
    this.placeFormValues.averageDuration = averageDuration
  }

  PlacetoCreate() {
    this.placeFormMode = false
    this.place = ''
    this.placeFormValues.name = ''
    this.placeFormValues.description = ''
    this.placeFormValues.averageDuration = ''
  }

  FormTitle() {
    if (this.placeFormMode) {
      return 'mod'
    } else {
      return 'crea'
    }
  }
}
</script>

<style></style>
