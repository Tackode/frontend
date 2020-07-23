<template>
  <div class="wrapped-container c-center c-medium my-3">
    <h2>{{ $t('infec') }}</h2>

    <BigActionButton
      v-if="places.length > 0"
      v-b-modal.infection-creation-modal
      class="mb-3"
      :title="$t('potinf')"
      :subtitle="$t('subtitle')"
      image="infection"
    />

    <p v-else>{{ $t('nopinf') }}</p>

    <b-table
      v-if="infections.length > 0"
      striped
      bordered
      hover
      head-variant="dark"
      variant="light"
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

    <b-modal
      id="infection-creation-modal"
      size="lg"
      :title="$t('infection-declaration-title')"
      :ok-title="$t('declare')"
      :cancel-title="$t('cancel')"
      @ok="handleModalOk"
      @hidden="resetModal"
    >
      <b-form @submit.stop.prevent="handleInfectionSubmit">
        <b-form-group id="infection-places" :label="$t('concerned-places')">
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

        <b-alert variant="info" show>{{
          $t('infection-max-period-info')
        }}</b-alert>

        <b-card bg-variant="light" class="mb-3">
          <b-form-group
            label-cols-lg="3"
            :label="$t('infection-start-label')"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              label-cols-sm="3"
              :label="$t('date-start-label')"
              label-align-sm="right"
              label-for="start-date"
            >
              <b-form-input
                id="start-date"
                type="date"
                v-model="infectionCreation.startDate"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              :label="$t('time-start-label')"
              label-align-sm="right"
              label-for="start-time"
            >
              <b-form-input
                id="start-time"
                type="time"
                v-model="infectionCreation.startTime"
              ></b-form-input>
            </b-form-group>
          </b-form-group>
        </b-card>

        <b-card bg-variant="light">
          <b-form-group
            label-cols-lg="3"
            :label="$t('infection-end-label')"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              label-cols-sm="3"
              :label="$t('date-end-label')"
              label-align-sm="right"
              label-for="end-date"
            >
              <b-form-input
                id="end-date"
                type="date"
                v-model="infectionCreation.endDate"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              :label="$t('time-end-label')"
              label-align-sm="right"
              label-for="end-time"
            >
              <b-form-input
                id="end-time"
                type="time"
                v-model="infectionCreation.endTime"
              ></b-form-input>
            </b-form-group>
          </b-form-group>
        </b-card>
      </b-form>
    </b-modal>
  </div>
</template>

<i18n>
{
  "en": {
    "close":"Close",
    "dec":"Declare Infection",
    "infec":"Declaration of Infections",
    "potinf":"Report a new infection in one or more of your places",
    "nopinf":"No place to declare an infection",
    "validate":"Validate",
    "infectedplace":"Infected Place",
    "startday":"Start Date",
    "enddate":"End Date",
    "delplace":"Deleted Place",
    "subtitle":"Record an infection to automatically notify your visitors",

    "infection-declaration-title": "New infection declaration",
    "concerned-places": "Concerned places",
    "infection-max-period-info": "Maximum duration on site: 12 hours.",
    "infection-start-label": "Date of arrival on site",
    "date-start-label": "Start date:",
    "time-start-label": "Start time:",
    "infection-end-label": "Date of departure from the place",
    "date-end-label": "End date:",
    "time-end-label": "End time:",
    "cancel": "Cancel",
    "declare": "Declare"
  },
  "fr": {
    "close":"Fermer",
    "dec":"Déclarer l'infection",
    "infec":"Déclarer une infection",
    "potinf":"Signalez une nouvelle infection dans un ou plusieurs de vos lieux.",
    "nopinf": "Vous n'avez pas de lieu sur lequel déclarer une infection.",
    "validate":"Valider",
    "modify":"Modifier",
    "infectedplace":"Lieux Infectés",
    "startday":"Date de début",
    "enddate":"Date de fin",
    "delplace":"Lieu supprimé",
    "subtitle":"Enregistrez une infection pour prévenir automatiquement vos visiteurs.",

    "infection-declaration-title": "Déclarer une nouvelle infection",
    "concerned-places": "Lieux concernés",
    "infection-max-period-info": "Durée maximale sur place : 12 heures.",
    "infection-start-label": "Date d'arrivée sur les lieux",
    "date-start-label": "Date d'arrivée :",
    "time-start-label": "Heure d'arrivée :",
    "infection-end-label": "Date de départ des lieux",
    "date-end-label": "Date de départ :",
    "time-end-label": "Heure de départ :",
    "cancel": "Annuler",
    "declare": "Déclarer"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../helpers/alerts'
import { Place } from '../../types/Place'
import BigActionButton from '~/components/BigActionButton.vue'

interface Infection {
  placesIds: String[]
  name: String[]
  organization: string
  startDate: string
  startTime: string
  startTimestamp: string
  endDate: string
  endTime: string
  endTimestamp: string
}

interface InfectionCreation {
  placesIds: String[]
  startDate: string
  startTime: string
  endDate: string
  endTime: string
}

@Component({
  components: {
    BigActionButton,
  },
})
export default class ProfessionalInfections extends Vue {
  fields = [
    { key: 'infected_places', label: this.tr('infectedplace') },
    { key: 'start_date', label: this.tr('startday') },
    { key: 'end_date', label: this.tr('enddate') },
  ]

  places: Place[] = []
  infections: Infection[] = []
  infectionCreation: InfectionCreation = {
    placesIds: [],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
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

  resetModal() {
    this.infectionCreation = {
      placesIds: [],
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    }
  }

  async handleModalOk(e: Event) {
    e.preventDefault()
    await this.handleInfectionSubmit()
  }

  async handleInfectionSubmit() {
    if (this.infectionCreation.placesIds.length === 0) {
      showError(
        this.$bvToast,
        'Infections',
        new Error('No affected place has been chosen.')
      )
      return
    }

    if (
      this.infectionCreation.startTime === '' ||
      this.infectionCreation.startDate === ''
    ) {
      showError(
        this.$bvToast,
        'Infections',
        new Error('The start of the infection is not defined.')
      )
      return
    }

    if (
      this.infectionCreation.endTime === '' ||
      this.infectionCreation.endDate === ''
    ) {
      showError(
        this.$bvToast,
        'Infections',
        new Error('The end of the infection is not defined.')
      )
      return
    }

    if (this.infectionCreation.startDate > this.infectionCreation.endDate) {
      showError(
        this.$bvToast,
        'Infections',
        new Error(
          'The end date of the infection is before the start date of the infection.'
        )
      )
      return
    }

    const startDate = new Date(
      `${this.infectionCreation.startDate} ${this.infectionCreation.startTime}`
    )

    const endDate = new Date(
      `${this.infectionCreation.endDate} ${this.infectionCreation.endTime}`
    )

    if (endDate >= new Date()) {
      showError(
        this.$bvToast,
        'Infections',
        new Error('You cannot declare infections in the future')
      )
      return
    }

    const distance = endDate.getTime() - startDate.getTime()
    if (distance > 43200000) {
      // 12 hours
      showError(
        this.$bvToast,
        'Infections',
        new Error('Maximum time of infection : 12 hours')
      )
      return
    }

    try {
      await this.$axios.$post(
        '/infection',
        {
          placesIds: this.infectionCreation.placesIds,
          startTimestamp: `${startDate.toISOString()}`,
          endTimestamp: `${endDate.toISOString()}`,
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

    this.$nextTick(() => {
      this.$bvModal.hide('infection-creation-modal')
    })

    this.loadData()
  }

  tr(ind: string) {
    return this.$i18n.t(ind)
  }

  getPlacesNameWithIds(ids: string[]): string {
    let result = ''

    const placesWithIds: any = {}
    this.places.forEach((place) => {
      placesWithIds[place.id] = place
    })

    ids.forEach((id) => {
      if (id in placesWithIds) {
        result += placesWithIds[id].name + ', '
      } else {
        result += this.$i18n.t('delplace') + ', '
      }
    })

    if (result.length > 0) {
      result = result.substring(0, result.length - 2)
    }

    return result
  }
}
</script>

<style></style>
