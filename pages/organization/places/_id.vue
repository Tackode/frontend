<template>
  <div class="wrapped-container c-medium c-center my-3">
    <p v-if="state === PlaceState.LOADING">
      {{ $t('wait') }}
    </p>

    <div v-else-if="state === PlaceState.NOTFOUND">
      <p>
        {{ $t('nex') }}
      </p>

      <nuxt-link
        class="no-print mt-3"
        :to="'/' + $i18n.locale + '/organization/places/'"
      >
        {{ $t('back') }}
      </nuxt-link>
    </div>

    <div v-else-if="state === PlaceState.LOADED">
      <nuxt-link
        class="no-print"
        :to="'/' + $i18n.locale + '/organization/places/'"
      >
        {{ $t('back') }}
      </nuxt-link>

      <b-button
        class="no-print my-3"
        @click="printPage"
        variant="primary"
        block
      >
        {{ $t('print') }}
      </b-button>

      <template v-if="place">
        <PlaceView :data="place" />

        <qrcode
          class="qrcode"
          :value="qrCodeUrl"
          :options="{ width: 400 }"
        ></qrcode>

        <p class="info">{{ $t('flash') }}</p>

        <div class="footer">
          <img
            alt="Covid Journal"
            class="img-fluid logo"
            src="~/assets/images/logo-covid-journal-print.png"
            width="400"
            height="68"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "back":"Back",
    "print":"Print the page",
    "flash":"Flash this QR Code to be informed of an infection",
    "nex":"This place does not exist.",
    "wait":"Loading. Please wait..."

  },
  "fr": {
    "back":"Retour",
    "print":"Imprimer",
    "flash":"Flashez le QR Code pour être informé d'une infection",
    "nex":"Ce lieu n'existe plus.",
    "wait":"Chargement en cours..."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Place } from '../../../types/Place'
import PlaceView from '../../../components/PlaceView.vue'

enum PlaceState {
  LOADING,
  LOADED,
  NOTFOUND,
}

@Component({
  components: {
    PlaceView,
  },
})
export default class PlaceDetail extends Vue {
  placeId: string | null = null
  place: Place | null = null
  name: string | null = null
  description: string | null = null
  organization: string | null = null
  state: PlaceState = PlaceState.LOADING

  // Bind enum for Vue
  PlaceState = PlaceState

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
      this.state = PlaceState.LOADED
    } catch (error) {
      this.state = PlaceState.NOTFOUND
    }
    this.organization = `${this.place?.organization?.name}`
    this.name = `${this.place?.name}`
    this.description = `${this.place?.description}`
  }

  printPage() {
    window.print()
  }

  get qrCodeUrl() {
    return (this as any).$env.FRONT_URL + '/check-in?placeId=' + this.placeId
  }
}
</script>

<style lang="scss">
.info {
  font-size: 1.5rem;
}

.footer {
  padding: 20px;
}

@media (max-width: 500px) {
  canvas {
    width: 280px !important;
    height: 280px !important;
  }
}

@media print {
  html {
    font-size: 25px;
  }

  .no-print,
  .no-print * {
    display: none !important;
  }

  canvas {
    width: 560px !important;
    height: 560px !important;
  }
}
</style>
