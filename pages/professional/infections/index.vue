<template>
  <div>
    <h1 class="sr-only">Infections</h1>

    <b-button v-b-modal.infection-creation-modal variant="primary" class="mb-2">
      Declare a potential infection
    </b-button>

    <b-table
      v-if="infections.length > 0"
      striped
      hover
      :fields="fields"
      :items="infections"
    >
      <template v-slot:cell(infection_name)="data">
        {{ data.item.name }}
      </template>

      <template v-slot:cell(average_duration)="data">
        {{ data.item.averageDuration }}m
      </template>
    </b-table>

    <b-modal id="infection-creation-modal" title="Infection Declaration">
      <b-form @submit="handleInfectionCreationSubmit">
        Select affected places:
        <b-form-group id="infection-places">
          <b-form-checkbox-group v-model="infectionCreation.placesIds">
            <b-form-checkbox
              v-for="place in places"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

        <p>Start date of the infection:</p>
        <b-calendar
          v-model="infectionCreation.startDate"
          locale="fr-FR"
        ></b-calendar>

        <b-time
          id="start-date-time"
          v-model="infectionCreation.startDateTime"
        ></b-time>
        <br />
        <br />

        <p>End date of the infection:</p>
        <b-calendar
          v-model="infectionCreation.endDate"
          locale="fr-FR"
        ></b-calendar>

        <b-time
          id="end-date-time"
          v-model="infectionCreation.endDateTime"
        ></b-time>
        <br />
        <br />

        <b-button type="submit" variant="primary">Create</b-button>
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
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'

interface Infectionreation {
  placesIds: String[]
  startDate: string
  startDateTime: string
  endDate: string
  endDateTime: string
}

@Component
export default class ProfessionalInfections extends Vue {
  fields = ['infected_places', 'start_date', 'end_date']
  places: Place[] = []
  infections: Place[] = []

  infectionCreation: Infectionreation = {
    placesIds: [],
    startDate: '',
    startDateTime: '',
    endDate: '',
    endDateTime: ''
  }

  mounted() {
    this.loadData()
  }

  async loadData() {
    const axiosConfig = {
      auth: {
        username: this.$store.getters['session/login'],
        password: this.$store.getters['session/token']
      }
    }

    try {
      this.places = await this.$axios.$get('/places', axiosConfig)
    } catch (error) {
      showError(
        this.$bvToast,
        'Infections',
        new Error('A network error occured. Please, try again.')
      )
      return
    }

    try {
      this.infections = await this.$axios.$get('/infections', axiosConfig)
    } catch (error) {
      showError(
        this.$bvToast,
        'Infections',
        new Error('A network error occured. Please, try again.')
      )
    }
  }

  async handleInfectionCreationSubmit(e: Event) {
    e.preventDefault()

    try {
      await this.$axios.$post(
        '/infection',
        {
          placesIds: this.infectionCreation.placesIds,
          startTimestamp: `${this.infectionCreation.startDate} ${this.infectionCreation.startDateTime}`,
          endTimestamp: `${this.infectionCreation.endDate} ${this.infectionCreation.endDateTime}`
        },
        {
          auth: {
            username: this.$store.getters['session/login'],
            password: this.$store.getters['session/token']
          }
        }
      )
    } catch (error) {
      showError(
        this.$bvToast,
        'Infections',
        new Error('A network error occured. Please, try again.')
      )
      return
    }

    this.$bvModal.hide('infection-creation-modal')

    this.loadData()
  }
}
</script>

<style></style>
