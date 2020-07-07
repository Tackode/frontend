<template>
  <div v-if="checkins.length > 0" class="wrapped-container container">
    <h1 class="sr-only">{{ $t('all-check-ins') }}</h1>

    <div v-if="infectedcheckins.length > 0">
      <h2>{{ $t('potential-contacts-with-infected') }}</h2>
      <br />
      <b-table striped hover :fields="fields" :items="infectedcheckins">
        <template v-slot:cell(organization)="data">
          <div class="red">{{ data.item.place.organization.name }}</div>
        </template>

        <template v-slot:cell(place_name)="data">
          <div class="red">{{ data.item.place.name }}</div>
        </template>

        <template v-slot:cell(time)="data">
          <div class="red">
            {{ data.item.startTimestamp | formatDateTime }}
          </div>
        </template>

        <template v-slot:cell(duration)="data">
          <div class="red">{{ data.item.duration }} minutes</div>
        </template>
      </b-table>
      <br />
    </div>

    <h2>{{ $t('my-check-ins') }}</h2>
    <br />
    <b-table striped hover :fields="fields" :items="checkins">
      <template v-slot:cell(organization)="data">
        {{ data.item.place.organization.name }}
      </template>

      <template v-slot:cell(place_name)="data">
        {{ data.item.place.name }}
      </template>

      <template v-slot:cell(time)="data">
        {{ data.item.startTimestamp | formatDateTime }}
      </template>

      <template v-slot:cell(duration)="data">
        {{ data.item.duration }} minutes
      </template>
    </b-table>
  </div>

  <div v-else>
    <h1 class="sr-only">{{ $t('all') }}</h1>
    <h2>{{ $t('my-check-ins') }}</h2>
    <br />
    <p>
      {{ $t('no-check-in') }}
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "all-check-ins": "All Check-ins",
    "potential-contacts-with-infected": "Potential contacts with infected people",
    "my-check-ins": "My Check-ins",
    "place": "Place Name",
    "organization": "Organization",
    "time": "Time",
    "duration": "Duration",
    "no-check-in": "You don't have any check-in for now. Scan a QR code in a public location to start."
  },
  "fr": {
    "all-check-ins": "Tous mes passages",
    "potential-contacts-with-infected": "Contacts potentiels avec une personne infectée",
    "my-check-ins": "Mes passages",
    "organization": "Organisation",
    "place": "Nom du lieu",
    "time": "Horaire de visite",
    "duration": "Durée",
    "no-check-in": "Vous n'avez aucun passage enregistré pour l'instant. Scannez un code QR pour commencer."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../helpers/alerts'
import { Checkin } from '../../types/Checkin'

@Component({})
export default class CheckIns extends Vue {
  fields = [
    { key: 'organization', label: this.tr('organization') },
    { key: 'place_name', label: this.tr('place') },
    { key: 'time', label: this.tr('time') },
    { key: 'duration', label: this.tr('duration') },
  ]

  checkins: Checkin[] = []
  infectedcheckins: Checkin[] = []

  async mounted() {
    // Load checkins
    try {
      this.checkins = await this.$axios.$get('/checkins', {
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
    }

    this.checkins.forEach((checkin) => {
      if (checkin.potentialInfection) {
        this.infectedcheckins.push(checkin)
      }
    })
  }

  tr(ind: string) {
    return this.$i18n.t(ind)
  }
}
</script>

<style>
.red {
  color: red;
}
</style>
