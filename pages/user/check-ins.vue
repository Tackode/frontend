<template>
  <div class="wrapped-container c-center c-medium my-3">
    <h1 class="sr-only">{{ $t('myCheckIns') }}</h1>

    <h2>{{ $t('myCheckIns') }}</h2>

    <BigActionButton
      class="mb-3"
      :title="$t('register')"
      :subtitle="$t('scan')"
      image="qr-code"
      :url="'/' + $i18n.locale + '/check-in'"
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
    "titlePage":"Covid Journal - Mes Visites"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { showError } from '../../helpers/alerts'
import { Checkin } from '../../types/Checkin'
import BigActionButton from '~/components/BigActionButton.vue'
import CardCheckin from '~/components/card-checkin/CardCheckin.vue'

@Component({
  components: {
    BigActionButton,
    CardCheckin,
  },
})
export default class CheckIns extends Vue {
  checkins: Checkin[] = []

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
  }

  tr(ind: string) {
    return this.$i18n.t(ind)
  }
}
</script>
