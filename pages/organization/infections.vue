<template>
  <div class="wrapped-container c-center c-medium my-3">
    <h2 class="text-center">{{ $t('infection') }}</h2>

    <BigActionButton
      v-if="places.length > 0"
      v-b-modal.infection-creation-modal
      class="mb-3"
      :title="$t('potentialInfection')"
      :subtitle="$t('subtitle')"
      image="infection"
    />

    <EmptyCard v-else :empty-text="$t('noPlaceInfection')"></EmptyCard>

    <div class="infections-list">
      <CardMode
        v-for="infection in infections"
        :mode="Mode.INFECTION"
        :key="infection.id"
        :infection="infection"
        :places="places"
      />
    </div>

    <b-modal
      id="infection-creation-modal"
      size="lg"
      :title="$t('infectionDeclarationTitle')"
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
              label-cols-sm="4"
              :label="$t('dateStartLabel')"
              label-align-sm="right"
              label-for="start-date"
            >
              <DatePicker
                id="start-date"
                v-model="infectionCreation.startDate"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              :label="$t('timeStartLabel')"
              label-align-sm="right"
              label-for="start-time"
            >
              <TimePicker
                id="start-time"
                v-model="infectionCreation.startTime"
              />
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
              label-cols-sm="4"
              :label="$t('dateEndLabel')"
              label-align-sm="right"
              label-for="end-date"
            >
              <DatePicker id="end-date" v-model="infectionCreation.endDate" />
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              :label="$t('timeEndLabel')"
              label-align-sm="right"
              label-for="end-time"
            >
              <TimePicker id="end-time" v-model="infectionCreation.endTime" />
            </b-form-group>
          </b-form-group>
        </b-card>
      </b-form>

      <template #modal-footer>
        <div class="w-100">
          <div class="float-left">
            <b-button variant="secondary" @click="resetModal">
              {{ $t('cancel') }}
            </b-button>
          </div>
          <b-button
            variant="primary"
            class="float-right"
            @click="handleModalOk"
          >
            {{ $t('declare') }}
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<i18n>
{
  "en": {
    "infection": "Declaration of Infections",
    "potentialInfection": "Report a new infection in one or more of your places",
    "noPlaceInfection": "No place to declare an infection",
    "validate": "Validate",
    "infectedPlace": "Infected Place",
    "delplace": "Deleted Place",
    "subtitle": "Record an infection to automatically notify your visitors",
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
    "noAffectedPlace": "noAffectedPlace",
    "startDateNotDefined": "The date of arrival is not defined.",
    "endDateNotDefined": "The date of departure is not defined.",
    "endDateBeforeStartDate": "The date of departure is before the date of arrival.",
    "noInfectionInTheFuture": "You cannot declare in the future",
    "maximumTime": "maximumTime",
    "networkError": "networkError",
    "Error": "Error",
    "titlePage": "Infections"
  },
  "fr": {
    "infection": "Déclarer une infection",
    "potentialInfection": "Signalez une nouvelle infection dans un ou plusieurs de vos lieux.",
    "noPlaceInfection": "Vous n'avez pas de lieu sur lequel déclarer une infection.",
    "validate": "Valider",
    "modify": "Modifier",
    "infectedPlace": "Lieux Infectés",
    "delplace": "Lieu supprimé",
    "subtitle": "Enregistrez une infection pour prévenir automatiquement vos visiteurs.",
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
    "noAffectedPlace": "Veuillez choisir un ou plusieurs lieu(x) concerné(s).",
    "startDateNotDefined": "La date d'arrivée n'a pas été définie.",
    "endDateNotDefined": "La date de départ n'a pas été définie.",
    "endDateBeforeStartDate": "La date de fin est avant ou égale à la date de début.",
    "noInfectionInTheFuture": "Vous ne pouvez pas déclarer dans le futur.",
    "maximumTime": "Durée maximale sur place : 12 heures",
    "networkError": "Une erreur réseau est survenue. S'il vous plaît, réessayer.",
    "Error": "Erreur",
    "titlePage": "Infections"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { showError } from '../../helpers/alerts'
import { Place } from '../../types/Place'
import { Infection, InfectionCreation } from '../../types/Infection'
import { Mode } from '~/types/CardMode'

@Component({
  middleware: ['auth-professional'],
  components: {
    BigActionButton: () => import('~/components/BigActionButton.vue'),
    DatePicker: () => import('~/components/DatePicker.vue'),
    TimePicker: () => import('~/components/TimePicker.vue'),
    CardMode: () => import('~/components/CardMode.vue'),
    EmptyCard: () => import('~/components/EmptyCard.vue'),
  },
  head(this: ProfessionalInfections) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
  async asyncData({ $axios }) {
    return {
      places: await $axios.$get<Place[]>('/places'),
      infections: await $axios.$get<Infection[]>('/infections'),
    }
  },
})
export default class ProfessionalInfections extends Vue {
  places: Place[] = []
  infections: Infection[] = []
  infectionCreation: InfectionCreation = {
    placesIds: [],
    startDate: null,
    startTime: '',
    startTimestamp: '',
    endDate: null,
    endTime: '',
    endTimestamp: '',
  }

  Mode = Mode

  resetModal() {
    this.$bvModal.hide('infection-creation-modal')

    this.infectionCreation = {
      placesIds: [],
      startDate: null,
      startTime: '',
      startTimestamp: '',
      endDate: null,
      endTime: '',
      endTimestamp: '',
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
      this.infectionCreation.startDate == null
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
      this.infectionCreation.endDate == null
    ) {
      showError(
        this.$bvToast,
        this.$i18n.t('Error') as string,
        new Error(this.$i18n.t('endDateNotDefined') as string)
      )
      return
    }

    const startDate = new Date(
      `${this.infectionCreation.startDate.toDateString()} ${
        this.infectionCreation.startTime
      }`
    )

    const endDate = new Date(
      `${this.infectionCreation.endDate.toDateString()} ${
        this.infectionCreation.endTime
      }`
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
      const infection = await this.$axios.$post<Infection>('/infection', {
        placesIds: this.infectionCreation.placesIds,
        startTimestamp: `${startDate.toISOString()}`,
        endTimestamp: `${endDate.toISOString()}`,
      })

      this.infections.unshift(infection)
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
  }
}
</script>
