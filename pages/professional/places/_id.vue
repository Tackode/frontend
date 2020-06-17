<template>
  <div>
    <nuxt-link class="no-print" to="/professional/places/">Back</nuxt-link>
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
      Flash this QR Code to be informed of an infection
    </p>
    <br />
    <a href="javascript:window.print()"
      ><b-button class="no-print">Print the page</b-button></a
    >
  </div>
</template>

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
          password: this.$store.getters['session/token']
        }
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
    width: 800px !important;
    height: 800px !important;
  }
  .printOnly {
    display: block;
  }
  p {
    font-size: 2em;
  }
}
</style>
