<template>
  <div>
    <nuxt-link
      class="no-print"
      :to="'/' + $i18n.locale + '/professional/places/'"
    >
      {{ $t('bk') }}
    </nuxt-link>
    <br />
    <h2>{{ organization }}</h2>
    <h2>
      <b>{{ name }}</b>
    </h2>
    <h3>
      <em>{{ description }}</em>
    </h3>

    <br />

    <qrcode :value="qrCodeUrl" :options="{ width: 400 }"></qrcode>
    <br />

    <p>
      {{ $t('flash') }}
    </p>
    <br />
    <b-button class="no-print" @click="PrintPage"> {{ $t('print') }} </b-button>
  </div>
</template>

<i18n>
{
  "en": {
    "bk":"Back",
    "print":"Print the page",
    "flash":"Flash this QR Code to be informed of an infection"
  },
  "fr": {
    "bk":"Retour",
    "print":"Imprimer",
    "flash":"Flasher le QR Code pour être informé d'une infection"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'

@Component
export default class PlaceDetail extends Vue {
  placeId: string | null = null
  place: Place | null = null
  name: string | null = null
  description: string | null = null
  organization: string | null = null

  mounted() {
    this.placeId = this.$route.params.id
    this.loadData()
  }

  async loadData() {
    try {
      this.place = await this.$axios.$get('/place/' + this.placeId, {
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
    this.organization = `${this.place?.organization?.name}`
    this.name = `${this.place?.name}`
    this.description = `${this.place?.description}`
  }

  PrintPage() {
    window.print()
  }

  get qrCodeUrl() {
    return (this as any).$env.FRONT_URL + '/check-in?placeId=' + this.placeId
  }
}
</script>

<style>
.printOnly {
  display: none;
}
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
  canvas {
    width: 560px !important;
    height: 560px !important;
  }
  .printOnly {
    display: block;
  }
  p {
    font-size: 2em;
  }
}
</style>
