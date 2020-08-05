<template>
  <div class="wrapped-container c-center c-medium my-3">
    <h1 class="sr-only">{{ $t('myCheckIns') }}</h1>

    <div v-if="infectedcheckins.length > 0">
      <h2>{{ $t('potentialContactsWithInfected') }}</h2>

      <div class="table-responsive">
        <b-table
          striped
          bordered
          hover
          head-variant="dark"
          variant="light"
          :fields="fields"
          :items="infectedcheckins"
        >
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
      </div>
    </div>

    <h2>{{ $t('myCheckIns') }}</h2>

    <BigActionButton
      class="mb-3"
      :title="$t('register')"
      :subtitle="$t('scan')"
      image="qr-code"
      :url="'/' + $i18n.locale + '/check-in'"
    />

    <div v-if="checkins.length > 0" class="table-responsive">
      <b-table
        striped
        bordered
        hover
        head-variant="dark"
        variant="light"
        :fields="fields"
        :items="checkins"
      >
        <template v-slot:cell(organization)="data">
          {{ data.item.place.organization.name }}
        </template>

        <template v-slot:cell(place_name)="data">
          <div v-b-tooltip.hover :title="data.item.place.description">
            {{ data.item.place.name }}
            <b-icon icon="info-circle"></b-icon>
          </div>
        </template>

        <template v-slot:cell(time)="data">
          {{ data.item.startTimestamp | formatDateTime }}
        </template>

        <template v-slot:cell(duration)="data">
          {{ data.item.duration }} minutes
        </template>
      </b-table>
    </div>

    <p v-else>
      {{ $t('noCheckIn') }}
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "register":"Register a place to be notified when an infection is reported",
    "scan" : "Scan the QR Code of the place where you are",
    "potentialContactsWithInfected": "Potential contacts with infected people",
    "myCheckIns": "My Check-ins",
    "place": "Place Name",
    "organization": "Organization",
    "time": "Time",
    "duration": "Duration",
    "noCheckIn": "You don't have any check-in for now.",
    "networkError":"A network error has occurred. Please, try again.",
    "titlePage":"Covid Journal - My Check-ins "
  },
  "fr": {
    "register":"Enregistrez un lieu de passage pour être informé en cas de signalement d'une infection.",
    "scan": "Scannez le QR Code du lieu dans lequel vous vous trouvez.",
    "potentialContactsWithInfected": "Contacts potentiels avec une personne infectée",
    "myCheckIns": "Mes Visites",
    "organization": "Organisation",
    "place": "Lieu visité",
    "time": "Horaire",
    "duration": "Durée",
    "noCheckIn": "Vous n'avez aucune visite enregistrée pour l'instant.",
    "networkError":"Une erreur réseau est apparue. S'il vous plaît, réessayer.",
    "titlePage":"Covid Journal - Mon Visites"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../helpers/alerts'
import { Checkin } from '../../types/Checkin'
import BigActionButton from '~/components/BigActionButton.vue'

@Component({
  components: {
    BigActionButton,
  },
})
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
    document.title = this.$i18n.t('titlePage') as string
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
        'Check-In',
        new Error(this.$i18n.t('networkError') as string)
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
