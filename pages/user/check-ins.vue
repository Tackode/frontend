<template>
  <div class="wrapped-container c-center c-medium my-3">
    <h1 class="sr-only">{{ $t('myCheckIns') }}</h1>

    <h2>{{ $t('myCheckIns') }}</h2>

    <BigActionButton
      class="mb-3"
      :title="$t('register')"
      :subtitle="$t('scan')"
      image="qr-code"
      :url="localePath('/check-in/')"
    />

    <div v-if="checkins.length > 0" class="checkins-list">
      <CardCheckin
        v-for="checkin in checkins"
        :key="checkin.id"
        :checkin="checkin"
      />
    </div>

    <p v-else>
      {{ $t('noCheckIn') }}
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "register": "Register a place to be notified when an infection is reported",
    "scan" : "Scan the QR Code of the place where you are",
    "potentialContactsWithInfected": "Potential contacts with infected people",
    "myCheckIns": "My Check-ins",
    "place": "Place Name",
    "organization": "Organization",
    "time": "Time",
    "duration": "Duration",
    "noCheckIn": "You don't have any check-in for now.",
    "networkError": "A network error has occurred. Please, try again.",
    "titlePage": "My Check-ins"
  },
  "fr": {
    "register": "Enregistrez un lieu de passage pour être informé en cas de signalement d'une infection.",
    "scan": "Scannez le QR Code du lieu dans lequel vous vous trouvez.",
    "potentialContactsWithInfected": "Contacts potentiels avec une personne infectée",
    "myCheckIns": "Mes Visites",
    "organization": "Organisation",
    "place": "Lieu visité",
    "time": "Horaire",
    "duration": "Durée",
    "noCheckIn": "Vous n'avez aucune visite enregistrée pour l'instant.",
    "networkError": "Une erreur réseau est apparue. S'il vous plaît, réessayer.",
    "titlePage": "Mes visites"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { Checkin } from '../../types/Checkin'

@Component({
  middleware: ['auth-user'],
  components: {
    BigActionButton: () => import('~/components/BigActionButton.vue'),
    CardCheckin: () => import('~/components/CardCheckin.vue'),
  },
  head(this: CheckIns) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
  async asyncData({ $axios }) {
    return {
      checkins: await $axios.$get<Checkin[]>('/checkins'),
    }
  },
})
export default class CheckIns extends Vue {
  checkins: Checkin[] = []
}
</script>
