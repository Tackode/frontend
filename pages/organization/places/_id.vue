<template>
  <div>
    <div
      v-if="state === PlaceState.LOADING"
      class="wrapped-container c-small c-center my-3"
    >
      <Loader />
    </div>

    <div
      v-else-if="state === PlaceState.NOTFOUND"
      class="wrapped-container c-small c-center my-3"
    >
      <p>
        {{ $t('placeNotFound') }}
      </p>

      <nuxt-link
        class="no-print mt-3"
        :to="localePath('/organization/places/')"
      >
        {{ $t('back') }}
      </nuxt-link>
    </div>

    <div
      v-else-if="state === PlaceState.LOADED"
      class="place-detail wrapped-container c-medium c-center my-3"
    >
      <div class="row no-print">
        <div class="col-6 text-left link-back">
          <nuxt-link :to="localePath('/organization/places/')">
            <img
              src="~/assets/images/back.png"
              srcset="
              ~/assets/images/back.png    1x,
              ~/assets/images/back@2x.png 2x
              ~/assets/images/back@3x.png 3x
            "
            />
            {{ $t('back') }}
          </nuxt-link>
        </div>
        <div class="col-6">
          <b-button class="my-3" @click="printPage" variant="primary" block>
            {{ $t('print') }}
          </b-button>
        </div>
      </div>

      <div class="card card-place">
        <template v-if="place">
          <PlaceView :data="place" />

          <div class="text-center">
            <qrcode
              class="qrcode"
              :value="qrCodeUrl"
              :options="{ width: 400 }"
            />
            <br />
            <img
              class="img-fluid"
              src="~/assets/images/scan-me.png"
              srcset="
              ~/assets/images/scan-me.png    1x,
              ~/assets/images/scan-me@2x.png 2x
              ~/assets/images/scan-me@3x.png 3x
            "
            />
          </div>

          <br />

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
  </div>
</template>

<i18n>
{
  "en": {
    "back": "Back",
    "print": "Print the page",
    "flash": "Flash this QR Code to be informed of an infection",
    "placeNotFound": "This place does not exist.",
    "titlePage": "Place"
  },
  "fr": {
    "back": "Retour",
    "print": "Imprimer",
    "flash": "Flashez le QR Code pour être informé d'une infection",
    "placeNotFound": "Ce lieu n'existe plus.",
    "titlePage": "Lieu"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { Place } from '../../../types/Place'

enum PlaceState {
  LOADING,
  LOADED,
  NOTFOUND,
}

@Component({
  components: {
    PlaceView: () => import('~/components/PlaceView.vue'),
    Loader: () => import('~/components/Loader.vue'),
  },
  head(this: PlaceDetail) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
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

    this.organization = this.place?.organization?.name ?? ''
    this.name = this.place?.name ?? ''
    this.description = this.place?.description ?? ''
  }

  printPage() {
    window.print()
  }

  get qrCodeUrl() {
    return `${this.$config.frontUrl}/check-in?placeId=${this.placeId}`
  }
}
</script>

<style lang="scss">
.place-detail {
  .link-back {
    padding-top: 20px;

    img {
      vertical-align: initial;
    }
  }

  .card-place {
    text-align: center;

    .card {
      box-shadow: none;
    }

    .info {
      font-size: 1.5rem;
    }

    .footer {
      padding: 20px;
    }
  }
}

@media (max-width: 500px) {
  canvas {
    width: 240px !important;
    height: 240px !important;
  }
}

@media print {
  html {
    font-size: 25px;
  }

  footer,
  .footer-push {
    display: none;
  }

  .no-print,
  .no-print * {
    display: none !important;
  }

  .place-detail {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  canvas {
    width: 560px !important;
    height: 560px !important;
  }
}
</style>
