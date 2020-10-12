<template>
  <div class="card card-padding">
    <div class="row">
      <div class="col-md-6">
        <div class="place-image-container">
          <img
            class="place-image"
            :src="require(`@/assets/images/${assetName}.png`)"
            :srcset="`
              ${require(`@/assets/images/${assetName}.png`)}    1x,
              ${require(`@/assets/images/${assetName}@2x.png`)} 2x,
              ${require(`@/assets/images/${assetName}@3x.png`)} 3x
            `"
          />
          <div class="overlay" v-if="displayOverlay">
            <span class="disclaimer">{{ $t('infectionDetected') }}</span>
          </div>
        </div>
      </div>

      <div v-if="mode === Mode.CHECKIN" class="col-md-6">
        <h2 class="organization-name">{{ checkin.place.organization.name }}</h2>
        <p class="place-name secondary">
          {{ checkin.place.name }}
          <b-icon
            v-b-tooltip.hover
            :title="checkin.place.description"
            icon="info-circle"
          ></b-icon>
        </p>
        <hr />
        <p class="mb-0">
          <strong>{{ $t('date') }}</strong>
          <span class="secondary">{{
            checkin.startTimestamp | formatDateTime
          }}</span>
        </p>
        <p class="mb-0">
          <strong>{{ $t('duration') }}</strong>
          <span class="secondary">{{ checkin.place.averageDuration }} min</span>
        </p>
      </div>

      <div v-else-if="mode === Mode.INFECTION" class="col-md-6">
        <h2 class="organization-name">{{ infection.organization.name }}</h2>
        <p class="place-name secondary">
          {{ getPlacesNameWithIds(infection.placesIds) }}
          <b-icon
            v-b-tooltip.hover
            :title="getPlacesDescriptionWithIds(infection.placesIds)"
            icon="info-circle"
          ></b-icon>
        </p>
        <hr />
        <p class="mb-0">
          <strong>{{ $t('startDate') }}</strong>
          <span class="secondary">{{
            infection.startTimestamp | formatDateTime
          }}</span>
        </p>
        <p class="mb-0">
          <strong>{{ $t('endDate') }}</strong>
          <span class="secondary">{{
            infection.endTimestamp | formatDateTime
          }}</span>
        </p>
      </div>

      <div v-else class="col-md-6">
        <h2 class="organization-name">{{ place.organization.name }}</h2>
        <p class="place-name secondary">
          {{ place.name }}
          <b-icon
            v-b-tooltip.hover
            :title="place.description"
            icon="info-circle"
          ></b-icon>
        </p>
        <hr />
        <p>
          <strong>{{ $t('duration') }}</strong>
          <span class="secondary">{{ place.averageDuration }} min</span>
        </p>

        <div class="row card-bottom">
          <div class="col-md-6">
            <nuxt-link
              :to="{
                path: localePath('/organization/places/qrcode/'),
                query: { placeId: place.id },
              }"
            >
              {{ $t('showQR') }}
            </nuxt-link>
          </div>
          <div class="col-md-6">
            <div class="place-edition-buttons">
              <b-button v-b-modal.place-creation-modal @click="editPlace">
                <img
                  :src="require('@/assets/images/edit.png')"
                  :srcset="`
                    ${require('@/assets/images/edit.png')}    1x,
                    ${require('@/assets/images/edit@2x.png')} 2x,
                    ${require('@/assets/images/edit@3x.png')} 3x
                  `"
                />
              </b-button>

              <b-button v-b-modal.place-delete-modal @click="deletePlace">
                <img
                  :src="require('@/assets/images/trash.png')"
                  :srcset="`
                    ${require('@/assets/images/trash.png')}    1x,
                    ${require('@/assets/images/trash@2x.png')} 2x,
                    ${require('@/assets/images/trash@3x.png')} 3x
                  `"
                />
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
{
    "en": {
        "infectionDetected": "Infection detected",
        "date": "Date :",
        "startDate": "Start Date :",
        "endDate": "End Date :",
        "duration": "Duration :",
        "deletedPlace": "Deleted place",
        "showQR": "Show QRCode"
    },
    "fr": {
        "infectionDetected": "Infection détectée",
        "date": "Date :",
        "startDate": "Date de début :",
        "endDate": "Date de fin :",
        "duration": "Durée :",
        "deletedPlace": "Lieu supprimé",
        "showQR": "Afficher QRCode"
    }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'nuxt-property-decorator'
import { Mode } from '~/types/CardMode'
import { Checkin } from '~/types/Checkin'
import { Infection } from '~/types/Infection'
import { Place } from '~/types/Place'

@Component({
  components: {
    NlToBr: () => import('~/components/NlToBr.vue'),
  },
})
export default class CardMode extends Vue {
  assetName: string = `place-photo-${Math.floor(Math.random() * 5) + 1}`
  Mode = Mode

  @Prop({
    required: true,
    validator: (mode) => Mode[mode] != null,
  })
  readonly mode!: Mode

  @Prop({ type: Object, required: false, default: null })
  readonly checkin!: Checkin | null

  @Prop({ type: Object, required: false, default: null })
  readonly infection!: Infection | null

  @Prop({ type: Array, required: false, default: null })
  readonly places!: Place[] | null

  @Prop({ type: Object, required: false, default: null })
  readonly place!: Place | null

  @Emit('onEdit')
  editPlace(): Place {
    return this.place!
  }

  @Emit('onDelete')
  deletePlace(): Place {
    return this.place!
  }

  getPlacesNameWithIds(ids: string[]): string {
    return ids
      .map(
        (selectedId) =>
          this.places?.find(({ id }) => selectedId === id)?.name ??
          this.$i18n.t('deletedPlace')
      )
      .join(', ')
  }

  getPlacesDescriptionWithIds(ids: string[]): string {
    return ids
      .map(
        (selectedId) =>
          this.places.find(({ id }) => selectedId === id)?.description ??
          this.$i18n.t('deletedPlace')
      )
      .join('\n')
  }

  get displayOverlay(): boolean {
    return (
      this.mode === Mode.INFECTION ||
      (this.mode === Mode.CHECKIN && this.checkin!.potentialInfection)
    )
  }
}
</script>

<style lang="scss">
.card-padding {
  padding: 24px;

  .secondary {
    color: $secondary;
  }

  .row {
    align-items: center;
    font-size: 1.25rem;
  }

  .card-bottom {
    a {
      font-size: 1rem;
    }

    .place-edition-buttons {
      button {
        &:first-child {
          margin-right: 10px;
        }

        margin: 0;
        padding: 0;
        border: none;
        background-color: transparent;
      }
    }
  }

  .place-image-container {
    border-radius: 5px;
    overflow: hidden;
    position: relative;

    .place-image {
      width: 100%;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 90, 95, 0.5);
      display: flex;
      text-align: center;
      align-items: center;

      .disclaimer {
        width: 100%;
        color: white;
        font-weight: bold;
        font-size: 2rem;
        font-family: $headings-font-family;
      }
    }
  }

  .organization-name {
    font-size: 2rem;
    margin-top: 16px;
    margin-bottom: 0;
  }

  @media (min-width: 768px) {
    .organization-name {
      font-size: 2.25rem;
      margin-top: 0;
    }

    .row {
      font-size: 1.5rem;
    }

    .place-image-container {
      .overlay {
        .disclaimer {
          font-size: 2.25rem;
        }
      }
    }

    .card-bottom {
      margin-top: 20px;

      .place-edition-buttons {
        text-align: right;
      }
    }
  }
}
</style>
