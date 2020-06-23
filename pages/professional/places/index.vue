<template>
  <div>
    <h1 class="sr-only">Places</h1>
    <h2>Your Places</h2>
    <br />
    <b-button v-b-modal.place-creation-modal variant="primary" class="mb-2">
      Create a place
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
        {{ data.item.averageDuration }}m
      </template>

      <template v-slot:cell(action)="data">
        <nuxt-link :to="'/professional/places/' + data.item.id"
          >Show QRCode</nuxt-link
        >
      </template>
      <template v-slot:cell(modify)>
        <b-button
          v-b-modal.place-creation-modal
          variant="outline-secondary"
          class="mb-2"
        >
          <b-icon icon="pencil"></b-icon>
        </b-button>
      </template>

      <template v-slot:cell(delete)>
        <b-button
          v-b-modal.place-delete-modal
          variant="outline-secondary"
          class="mb-2"
        >
          <b-icon icon="trash"></b-icon>
        </b-button>
      </template>
    </b-table>
    <p v-else>
      You don't have any places for now. Please, create a place to begin.
    </p>

    <b-modal id="place-creation-modal" title="Place Creation">
      <b-form @submit="handleplaceFormValuesSubmit">
        <b-form-group label="Name:" label-for="place-name">
          <b-form-input
            id="place-name"
            v-model="placeFormValues.name"
            required
            placeholder="Name"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Description:" label-for="place-description">
          <b-form-input
            id="place-description"
            v-model="placeFormValues.description"
            required
            placeholder="Description"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Average Duration of the stay:"
          label-for="place-average-duration"
        >
          <b-form-input
            id="place-average-duration"
            v-model="placeFormValues.averageDuration"
            required
            placeholder="Average Duration"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Create</b-button>
      </b-form>

      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>

    <b-modal id="place-delete-modal" title="Delete Place">
      <b-form @submit="handleplaceFormValuesDelete">
        Do you really want to delete the place?
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
  fields = ['place_name', 'average_duration', 'action', 'modify', 'delete']
  places: Place[] = []
  placeFormMode: Boolean = false
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

    this.$bvModal.hide('place-creation-modal')

    this.loadData()
  }

  async handleplaceFormValuesModify(e: Event) {
    e.preventDefault()

    try {
      await this.$axios.$put(
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

    this.$bvModal.hide('place-creation-modal')

    this.loadData()
  }

  async handleplaceFormValuesDelete(e: Event) {
    e.preventDefault()
    try {
      await this.$axios.$delete('/place/', {
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
}
</script>

<style></style>
