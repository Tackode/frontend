<template>
  <div>
    <h1 class="sr-only">Infections</h1>
    <h2>Declaration of Infection</h2>
    <br />
    <b-button v-b-modal.infection-creation-modal variant="primary" class="mb-2">
      Declare a potential infection
    </b-button>
    <br />
    <br />
    <b-table
      v-if="infections.length > 0"
      striped
      hover
      :fields="fields"
      :items="infections"
    >
      <template v-slot:cell(infected_places)="data">
        {{ getPlacesNameWithIds(data.item.placesIds) }}
      </template>

      <template v-slot:cell(start_date)="data">
        {{ data.item.startTimestamp | formatDateTime }}
      </template>
      <template v-slot:cell(end_date)="data">
        {{ data.item.endTimestamp | formatDateTime }}
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
  name: String[]
  organization: string
  startDate: string
  startDateTime: string
  startTimestamp: string
  endDate: string
  endDateTime: string
  endTimestamp: string
}

@Component
export default class ProfessionalInfections extends Vue {
  fields = ['infected_places', 'start_date', 'end_date']
  places: Place[] = []
  infections: Infectionreation[] = []
  infectionCreation: Infectionreation = {
    placesIds: [],
    name: [],
    organization: '',
    startDate: '',
    startDateTime: '',
    startTimestamp: '',
    endDate: '',
    endDateTime: '',
    endTimestamp: '',
  }

  mounted() {
    this.loadData()
  }

  async loadData() {
    const axiosConfig = {
      auth: {
        username: this.$store.getters['session/login'],
        password: this.$store.getters['session/token'],
      },
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
    if (this.infectionCreation.placesIds.length > 0) {
      if (
        this.infectionCreation.startDateTime !== '' &&
        this.infectionCreation.startDate !== ''
      ) {
        if (
          this.infectionCreation.endDateTime !== '' &&
          this.infectionCreation.endDate !== ''
        ) {
          if (
            this.infectionCreation.startDate <= this.infectionCreation.endDate
          ) {
            try {
              await this.$axios.$post(
                '/infection',
                {
                  placesIds: this.infectionCreation.placesIds,
                  startTimestamp: `${this.infectionCreation.startDate}T${this.infectionCreation.startDateTime}Z`,
                  endTimestamp: `${this.infectionCreation.endDate}T${this.infectionCreation.endDateTime}Z`,
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
                'Infections',
                new Error('A network error occured. Please, try again.')
              )
              return
            }
          } else {
            showError(
              this.$bvToast,
              'Infections',
              new Error(
                'The end date of the infection is before the start date of the infection.'
              )
            )
          }
        } else {
          showError(
            this.$bvToast,
            'Infections',
            new Error('The end of the infection is not defined.')
          )
        }
      } else {
        showError(
          this.$bvToast,
          'Infections',
          new Error('The start of the infection is not defined.')
        )
      }
    } else {
      showError(
        this.$bvToast,
        'Infections',
        new Error('No affected place has been chosen.')
      )
    }

    this.$bvModal.hide('infection-creation-modal')

    this.loadData()
  }

  getPlacesNameWithIds(ids: string[]): string {
    let result = ''

    const placesWithIds: any = {}
    this.places.forEach((place) => {
      placesWithIds[place.id] = place
    })

    ids.forEach((id) => {
      result += placesWithIds[id].name + ', '
    })

    if (result.length > 0) {
      result = result.substring(0, result.length - 2)
    }

    return result
  }
}
</script>

<style></style>
