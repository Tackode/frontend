<template>
  <div class="wrapped-container c-center c-medium my-3">
    <h2>{{ $t('infection') }}</h2>

    <BigActionButton
      v-if="places.length > 0"
      v-b-modal.infection-creation-modal
      class="mb-3"
      :title="$t('potentialInfection')"
      :subtitle="$t('subtitle')"
      image="infection"
    />

    <p v-else>{{ $t('noPlaceInfection') }}</p>

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
      :title="$t('infectionDeclarationTitle')"
      :okTitle="$t('declare')"
      :cancelTitle="$t('cancel')"
      @ok="handleModalOk"
      @hidden="resetModal"
    >
      <b-form @submit.stop.prevent="handleInfectionSubmit">
        <b-form-group id="infectionPlaces" :label="$t('concernedPlaces')">
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
          $t('infectionMaxPeriodInfo')
        }}</b-alert>

        <b-card bg-variant="light" class="mb-3">
          <b-form-group
            label-cols-lg="3"
            :label="$t('infectionStartLabel')"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              label-cols-sm="3"
              :label="$t('dateStartLabel')"
              label-align-sm="right"
              label-for="start-date"
            >
              <b-form-input
                id="start-date"
                type="date"
                v-model="infectionCreation.startDate"
                placeholder="MM/DD/YYYY"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              :label="$t('timeStartLabel')"
              label-align-sm="right"
              label-for="start-time"
            >
              <b-form-input
                id="start-time"
                type="time"
                v-model="infectionCreation.startTime"
                placeholder="12:00:00"
              ></b-form-input>
            </b-form-group>
          </b-form-group>
        </b-card>

        <b-card bg-variant="light">
          <b-form-group
            label-cols-lg="3"
            :label="$t('infectionEndLabel')"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              label-cols-sm="3"
              :label="$t('dateEndLabel')"
              label-align-sm="right"
              label-for="end-date"
            >
              <b-form-input
                id="end-date"
                type="date"
                placeholder="MM/DD/YYYY"
                v-model="infectionCreation.endDate"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              :label="$t('timeEndLabel')"
              label-align-sm="right"
              label-for="end-time"
            >
              <b-form-input
                id="end-time"
                type="time"
                placeholder="12:00:00"
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
    "infection":"Declaration of Infections",
    "potentialInfection":"Report a new infection in one or more of your places",
    "noPlaceInfection":"No place to declare an infection",
    "validate":"Validate",
    "infectedPlace":"Infected Place",
    "startDay":"Start Date",
    "endDate":"End Date",
    "delplace":"Deleted Place",
    "subtitle":"Record an infection to automatically notify your visitors",

    "infectionDeclarationTitle": "New infection declaration",
    "concernedPlaces": "Concerned places",
    "infectionMaxPeriodInfo": "Maximum duration on site: 12 hours.",
    "infectionStartLabel": "Date of arrival on site",
    "dateStartLabel": "Start date:",
    "timeStartLabel": "Start time:",
    "infectionEndLabel": "Date of departure from the place",
    "dateEndLabel": "End date:",
    "timeEndLabel": "End time:",
    "cancel": "Cancel",
    "declare": "Declare",
    "noAffectedPlace":"noAffectedPlace",
    "startDateNotDefined":"The date of arrival is not defined.",
    "endDateNotDefined":"The date of departure is not defined.",
    "endDateBeforeStartDate":"The date of departure is before the date of arrival.",
    "noInfectionInTheFuture":"You cannot declare in the future",
    "maximumTime":"maximumTime",
    "networkError":"networkError",
    "Error":"Error"
  },
  "fr": {
    "infection":"Déclarer une infection",
    "potentialInfection":"Signalez une nouvelle infection dans un ou plusieurs de vos lieux.",
    "noPlaceInfection": "Vous n'avez pas de lieu sur lequel déclarer une infection.",
    "validate":"Valider",
    "modify":"Modifier",
    "infectedPlace":"Lieux Infectés",
    "startDay":"Date de début",
    "endDate":"Date de fin",
    "delplace":"Lieu supprimé",
    "subtitle":"Enregistrez une infection pour prévenir automatiquement vos visiteurs.",

    "infectionDeclarationTitle": "Déclarer une nouvelle infection",
    "concernedPlaces": "Lieux concernés",
    "infectionMaxPeriodInfo": "Durée maximale sur place : 12 heures.",
    "infectionStartLabel": "Date d'arrivée sur les lieux",
    "dateStartLabel": "Date d'arrivée :",
    "timeStartLabel": "Heure d'arrivée :",
    "infectionEndLabel": "Date de départ des lieux",
    "dateEndLabel": "Date de départ :",
    "timeEndLabel": "Heure de départ :",
    "cancel": "Annuler",
    "declare": "Déclarer",
    "noAffectedPlace":"Veuillez choisir un ou plusieurs lieu(x) concerné(s).",
    "startDateNotDefined":"La date d'arrivée n'a pas été définie.",
    "endDateNotDefined":"La date de départ n'a pas été définie.",
    "endDateBeforeStartDate":"La date de fin est avant ou égale à la date de début.",
    "noInfectionInTheFuture":"Vous ne pouvez pas déclarer dans le futur.",
    "maximumTime":"Durée maximale sur place : 12 heures",
    "networkError":"Une erreur réseau est survenue. S'il vous plaît, réessayer.",
    "Error":"Erreur"
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
    { key: 'infected_places', label: this.tr('infectedPlace') },
    { key: 'start_date', label: this.tr('startDay') },
    { key: 'end_date', label: this.tr('endDate') },
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
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('networkError') as string)
      )
      return
    }

    try {
      this.infections = await this.$axios.$get('/infections', axiosConfig)
    } catch (error) {
      showError(
        this.$bvToast,
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('networkError') as string)
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
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('noAffectedPlace') as string)
      )
      return
    }

    if (
      this.infectionCreation.startTime === '' ||
      this.infectionCreation.startDate === ''
    ) {
      showError(
        this.$bvToast,
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('startDateNotDefined') as string)
      )
      return
    }

    if (
      this.infectionCreation.endTime === '' ||
      this.infectionCreation.endDate === ''
    ) {
      showError(
        this.$bvToast,
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('endDateNotDefined') as string)
      )
      return
    }

    const startDate = new Date(
      `${this.infectionCreation.startDate} ${this.infectionCreation.startTime}`
    )

    const endDate = new Date(
      `${this.infectionCreation.endDate} ${this.infectionCreation.endTime}`
    )
    const distance = endDate.getTime() - startDate.getTime()

    if (distance <= 0) {
      showError(
        this.$bvToast,
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('endDateBeforeStartDate') as string)
      )
      return
    }

    if (endDate >= new Date()) {
      showError(
        this.$bvToast,
        'Infections',
        new Error(this.$i18n.t('noInfectionInTheFuture') as string)
      )
      return
    }

    if (distance > 43200000) {
      // 12 hours
      showError(
        this.$bvToast,
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('maximumTime') as string)
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
        this.$i18n.t('Error') as string,
        new Error(
          this.$i18n.t('A nework error occured. Please, try again.') as string
        )
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
