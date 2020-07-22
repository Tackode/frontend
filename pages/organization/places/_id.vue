<template>
  <div class="wrapped-container medium center my-3">
    <nuxt-link
      class="no-print"
      :to="'/' + $i18n.locale + '/organization/places/'"
    >
      {{ $t('back') }}
    </nuxt-link>

    <b-button class="no-print my-3" @click="PrintPage" variant="primary" block>
      {{ $t('print') }}
    </b-button>

    <template v-if="place">
      <PlaceView :data="place" />

      <qrcode
        class="align-self-center"
        :value="qrCodeUrl"
        :options="{ width: 400 }"
      ></qrcode>

      <p class="info">{{ $t('flash') }}</p>

      <div class="footer">
        <img
          :alt="$t('covidjournal')"
          class="img-fluid logo"
          src="~/assets/images/logo-covid-journal-print.png"
        />
      </div>
    </template>
  </div>
</template>

<i18n>
{
  "en": {
    "back":"Back",
    "print":"Print the page",
    "flash":"Flash this QR Code to be informed of an infection"
  },
  "fr": {
    "back":"Retour",
    "print":"Imprimer",
    "flash":"Flashez le QR Code pour être informé d'une infection"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'
import PlaceView from '../../../components/PlaceView.vue'

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

<style lang="scss">
.footer {
  padding: 20px;

  .logo {
    height: 70px;
  }
}

.info {
  font-size: 1.5rem;
}

.print-only {
  display: none;
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

  .print-only {
    display: block;
  }
}
</style>
