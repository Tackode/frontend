<template>
  <div class="card card-checkin">
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
          <div class="overlay" v-if="checkin.potentialInfection">
            <span class="disclaimer">Infection détectée</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h2 class="place-name">{{ checkin.place.name }}</h2>
        <NlToBr
          tag="p"
          :text="checkin.place.description"
          class-name="place-description"
        />
        <hr />
        <p>
          <strong>Date :</strong>
          {{ checkin.startTimestamp | formatDateTime }}
        </p>
        <p><strong>Durée :</strong> {{ checkin.place.averageDuration }} min</p>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
  },
  "fr": {
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Checkin } from '~/types/Checkin'

@Component({
  components: {
    NlToBr: () => import('~/components/NlToBr.vue'),
  },
})
export default class CardCheckin extends Vue {
  assetName: string = `place-photo-${Math.floor(Math.random() * 5) + 1}`

  @Prop({ type: Object, required: true }) readonly checkin!: Checkin
}
</script>

<style lang="scss">
.card-checkin {
  text-align: left;
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
