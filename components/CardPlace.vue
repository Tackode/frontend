<template>
  <div class="card card-place">
    <div class="row">
      <div class="col-md-6">
        <div class="place-image-container">
          <img
            class="place-image"
            src="~/assets/images/place-photo-1.png"
            srcset="
              ~/assets/images/place-photo-1.png    1x,
              ~/assets/images/place-photo-1@2x.png 2x
              ~/assets/images/place-photo-1@3x.png 3x
            "
          />
        </div>
      </div>
      <div class="col-md-6">
        <h2 class="place-name">{{ place.name }}</h2>
        <p class="place-description">{{ place.description }}</p>
        <hr />
        <p><strong>Durée :</strong> {{ place.averageDuration }} min</p>

        <div class="row card-bottom">
          <div class="col-md-6">
            <nuxt-link :to="localePath(`/organization/places/${place.id}`)">
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
    "showQR": "Show QRCode"
  },
  "fr": {
    "showQR": "Afficher QRCode"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'nuxt-property-decorator'
import { Place } from '~/types/Place'

@Component
export default class CardPlace extends Vue {
  @Prop({ type: Object, required: true }) readonly place!: Place

  @Emit('onEdit')
  editPlace(): Place {
    return this.place
  }

  @Emit('onDelete')
  deletePlace(): Place {
    return this.place
  }
}
</script>

<style lang="scss">
.card-place {
  text-align: left;
  padding: 24px;

  .place-image-container {
    .place-image {
      width: 100%;
      border-radius: 5px;
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
