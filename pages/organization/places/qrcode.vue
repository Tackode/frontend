<template>
  <div>
    <div class="place-detail wrapped-container c-medium c-center my-3">
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
    "placeNotFound": "Ce lieu n'existe pas.",
    "titlePage": "Lieu"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { Place } from '../../../types/Place'

@Component({
  middleware: ['auth-professional'],
  components: {
    PlaceView: () => import('~/components/PlaceView.vue'),
  },
  head(this: PlaceDetail) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
  async asyncData({ route, $axios, error }) {
    const { placeId } = route.query

    if (typeof placeId !== 'string' || placeId.length === 0) {
      throw error({
        statusCode: 404,
      })
    }

    try {
      return {
        place: await $axios.$get<Place>(`/place/${placeId}`),
      }
    } catch (error) {
      throw error({
        statusCode: 404,
      })
    }
  },
})
export default class PlaceDetail extends Vue {
  place: Place | null = null

  printPage() {
    window.print()
  }

  get qrCodeUrl() {
    return `${this.$config.frontUrl}/check-in/?placeId=${this.place?.id}`
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
