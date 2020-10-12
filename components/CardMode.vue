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
        <h2 class="place-name">{{ checkin.place.name }}</h2>
        <NlToBr
          tag="p"
          :text="checkin.place.description"
          class-name="place-description"
        />
        <hr />
        <p>
          <strong>{{ $t('date') }}</strong>
          {{ checkin.startTimestamp | formatDateTime }}
        </p>
        <p>
          <strong>{{ $t('duration') }}</strong>
          {{ checkin.place.averageDuration }} min
        </p>
      </div>

      <div v-else-if="mode === Mode.INFECTION" class="col-md-6">
        <h2 class="place-name">
          {{ getPlacesNameWithIds(infection.placesIds) }}
        </h2>
        <hr />
        <p>
          <strong>{{ $t('startDate') }}</strong>
          {{ infection.startTimestamp | formatDateTime }}
        </p>
        <p>
          <strong>{{ $t('endDate') }}</strong>
          {{ infection.endTimestamp | formatDateTime }}
        </p>
      </div>

      <div v-else class="col-md-6">
        <h2 class="place-name">{{ place.name }}</h2>
        <NlToBr
          tag="p"
          :text="place.description"
          class-name="place-description"
        />
        <hr />
        <p>
          <strong>{{ $t('duration') }}</strong> {{ place.averageDuration }} min
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
              <b-button
                v-b-modal.place-creation-modal
                variant="outline-secondary"
                class="mb-2"
                @click="editPlace"
              >
                <b-icon icon="pencil"></b-icon>
              </b-button>

              <b-button
                v-b-modal.place-delete-modal
                variant="outline-secondary"
                class="mb-2"
                @click="deletePlace"
              >
                <b-icon icon="trash"></b-icon>
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
        "date": "Date: ",
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
        font-size: 2.2em;
        font-family: $headings-font-family;
      }
    }
  }

  .place-name {
    margin-top: 20px;
    margin-bottom: 0;
  }

  .place-description {
    color: $secondary;
  }

  @media (min-width: 768px) {
    .place-name {
      margin-top: 0;
    }

    .card-bottom {
      margin-top: 60px;

      .place-edition-buttons {
        text-align: right;
      }
    }
  }
}
</style>
