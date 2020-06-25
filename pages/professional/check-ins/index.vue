<template>
  <div v-if="checkins.length > 0">
    <h1 class="sr-only">{{ $t('all') }}</h1>

    <div v-if="infectedcheckins.length > 0">
      <h2>{{ $t('infchec') }}</h2>
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
            {{ data.item.start_timestamp | formatDateTime }}
          </div>
        </template>

        <template v-slot:cell(duration)="data">
          <div class="red">{{ data.item.duration }} minutes</div>
        </template>
      </b-table>
      <br />
    </div>

    <h2>{{ $t('chec') }}</h2>
    <br />
    <b-table striped hover :fields="fields" :items="checkins">
      <template v-slot:cell(organization)="data">
        {{ data.item.place.organization.name }}
      </template>

      <template v-slot:cell(place_name)="data">
        {{ data.item.place.name }}
      </template>

      <template v-slot:cell(time)="data">
        {{ data.item.start_timestamp | formatDateTime }}
      </template>

      <template v-slot:cell(duration)="data">
        {{ data.item.duration }} minutes
      </template>
    </b-table>
  </div>

  <div v-else>
    <h1 class="sr-only">{{ $t('all') }}</h1>
    <h2>{{ $t('chec') }}</h2>
    <br />
    <p>
      {{ $t('nochec') }}
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "all":"All Check-ins",
    "infchec":"Infected Check-ins",
    "chec":"My Check-ins",
    "nochec":"You don't have any check-in for now. Scan a QR code in a public location to start."
  },
  "fr": {
    "all":"Tous les Check-ins",
    "infchec":"Check-ins infectés",
    "chec":"Mes Check-ins",
    "nochec":"Vous n'avez aucun check-in pour l'instant. Scannez un code QR pour commencer."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../../helpers/alerts'
import { Checkin } from '../../../types/Checkin'

@Component({})
export default class ProfessionalCheckIns extends Vue {
  fields = ['organization', 'place_name', 'time', 'duration']
  checkins: Checkin[] = []
  infectedcheckins: Checkin[] = []

  async mounted() {
    //  Load checkins
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
      if (checkin.potential_infection) {
        this.infectedcheckins.push(checkin)
      }
    })
  }
}
</script>

<style>
.red {
  color: red;
}
</style>
