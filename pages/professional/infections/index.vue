<template>
  <div class="wrapped-container container">
    <h1 class="sr-only">Infections</h1>
    <h2>{{ $t('infec') }}</h2>

    <div v-if="places.length > 0">
      <br />
      <b-button
        v-b-modal.infection-creation-modal
        variant="primary"
        class="mb-2"
      >
        {{ $t('potinf') }}
      </b-button>
      <br />
      <br />
    </div>

    <p v-else>{{ $t('nopinf') }}</p>

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

    <b-modal id="infection-creation-modal" :title="$t('af')">
      <b-form @submit="handleInfectionCreationSubmit">
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
        {{ $t('start') }}
        <b-form-input
          v-model="infectionCreation.startDate"
          readonly
          :placeholder="$t('st')"
        ></b-form-input>
        <b-form-input
          v-model="infectionCreation.startDateTime"
          readonly
          :placeholder="$t('sth')"
        ></b-form-input>
        <b-button
          class="center"
          v-b-modal.infection-creation2-modal
          variant="primary"
        >
          {{ $t('md') }}
        </b-button>
        <br />
        {{ $t('end') }}
        <b-form-input
          v-model="infectionCreation.endDate"
          readonly
          :placeholder="$t('fin')"
        ></b-form-input>
        <b-form-input
          v-model="infectionCreation.endDateTime"
          readonly
          :placeholder="$t('finh')"
        ></b-form-input>
        <b-button v-b-modal.infection-creation3-modal variant="primary">
          {{ $t('md') }}
        </b-button>
        <br />
        <br />
        <b-button
          variant="primary"
          @click="$bvModal.hide('infection-creation-modal')"
        >
          {{ $t('close') }}
        </b-button>
        <b-button
          type="submit"
          variant="primary"
          @click="$bvModal.hide('infection-creation-modal')"
        >
          {{ $t('dec') }}
        </b-button>
      </b-form>
      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>

    <b-modal id="infection-creation2-modal" :title="$t('st')">
      <b-form>
        <b-calendar v-model="infectionCreation.startDate"></b-calendar>

        <b-time
          id="start-date-time"
          v-model="infectionCreation.startDateTime"
        ></b-time>
        <br />
        <br />
        <b-button
          variant="primary"
          @click="$bvModal.hide('infection-creation2-modal')"
        >
          {{ $t('vl') }}
        </b-button>
      </b-form>

      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>

    <b-modal id="infection-creation3-modal" :title="$t('fin')">
      <b-form>
        <p>{{ $t('max') }}</p>
        <b-calendar v-model="infectionCreation.endDate"></b-calendar>

        <b-time
          id="end-date-time"
          v-model="infectionCreation.endDateTime"
        ></b-time>
        <br />
        <br />
        <b-button
          @click="$bvModal.hide('infection-creation3-modal')"
          variant="primary"
        >
          {{ $t('vl') }}
        </b-button>
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
    "st":"Start Date of the Infection*",
    "fin":"End Date of the Infection*",
    "sth":"Start Time of the Infection*",
    "finh":"End Time of the Infection*",
    "af":"Select affected places*",
    "max":"Maximum duration of infection: 12 hours",
    "close":"Close",
    "dec":"Declare Infection",
    "start":"Start date :",
    "end":"End date :",
    "infec":"Declaration of Infections",
    "potinf":"Declare a potential infection",
    "nopinf":"No place to declare an infection",
    "vl":"Validate",
    "md":"Modify",
    "inf":"Infected Place",
    "sda":"Start Date",
    "eda":"End Date",
    "d":"Deleted Place"
  },
  "fr": {
    "st":"Date de début de l'infection*",
    "fin":"Date de fin de l'infection*",
    "sth":"Heure de début de l'infection*",
    "finh":"Heure de fin de l'infection*",
    "af":"Lieux infectés*",
    "max":"Durée maximale d'infection: 12 heures",
    "close":"Fermer",
    "dec":"Déclarer l'infection",
    "start":"Date de début :",
    "end":"Date de fin :",
    "infec":"Déclarer une infection",
    "potinf":"Déclarer une infection potentielle",
    "nopinf": "Vous n'avez pas de lieu sur lequel déclarer une infection.",
    "vl":"Valider",
    "md":"Modifier",
    "inf":"Lieux Infectés",
    "sda":"Date de début",
    "eda":"Date de fin",
    "d":"Lieu supprimé"
  }
}
</i18n>

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
  fields = [
    { key: 'infected_places', label: this.tr('inf') },
    { key: 'start_date', label: this.tr('sda') },
    { key: 'end_date', label: this.tr('eda') },
  ]

  places: Place[] = []
  infections: Infectionreation[] = []
  startDate: string = ''
  endDate: string = ''
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
            this.startDate = new Date(
              `${this.infectionCreation.startDate} ${this.infectionCreation.startDateTime}`
            ).toISOString()
            this.endDate = new Date(
              `${this.infectionCreation.endDate} ${this.infectionCreation.endDateTime}`
            ).toISOString()
            try {
              await this.$axios.$post(
                '/infection',
                {
                  placesIds: this.infectionCreation.placesIds,
                  startTimestamp: `${this.startDate}`,
                  endTimestamp: `${this.endDate}`,
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
              showError(
                this.$bvToast,
                'Infections',
                new Error('Maximum time of infection : 12 hours')
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

    this.$bvModal.hide('infection-creation3-modal')

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
        result += this.$i18n.t('d') + ', '
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
