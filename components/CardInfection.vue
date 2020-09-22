<template>
  <div class="card card-infection">
    <div class="row">
      <div class="col-md-6">
        <div class="infection-image-container">
          <img
            class="infection-image"
            src="~/assets/images/place-photo-1.png"
            srcset="
              ~/assets/images/place-photo-1.png    1x,
              ~/assets/images/place-photo-1@2x.png 2x
              ~/assets/images/place-photo-1@3x.png 3x
            "
          />
          <div class="overlay">
            <span class="disclaimer">Infection détectée</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h2 class="infection-name">
          {{ getPlacesNameWithIds(infection.placesIds) }}
        </h2>
        <hr />
        <p>
          <strong>{{ $t('startDay') }}</strong>
          {{ infection.startTimestamp | formatDateTime }}
        </p>
        <p>
          <strong>{{ $t('endDate') }}</strong>
          {{ infection.endTimestamp | formatDateTime }}
        </p>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "startDay":"Start Date",
    "endDate":"End Date"
  },
  "fr": {
    "startDay":"Date de début",
    "endDate":"Date de fin"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Infection } from '~/types/Infection'
import { Place } from '~/types/Place'

@Component
export default class CardInfection extends Vue {
  @Prop({ type: Object, required: true }) readonly infection!: Infection
  @Prop({ type: Array, required: true }) readonly places!: Place[]

  getPlacesNameWithIds(ids: string[]): string {
    let result = ''

    const placesWithIds: any = {}
    this.places.forEach((place) => {
      placesWithIds[place.id] = place
    })

    ids.forEach((id) => {
      if (id in placesWithIds) {
        result += placesWithIds[id].name + ', '
      } else {
        result += this.$i18n.t('delplace') + ', '
      }
    })

    if (result.length > 0) {
      result = result.substring(0, result.length - 2)
    }

    return result
  }
}
</script>

<style lang="scss">
.card-infection {
  text-align: left;
  padding: 24px;

  .infection-image-container {
    position: relative;
    border-radius: 5px;
    overflow: hidden;

    .infection-image {
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

  .infection-name {
    margin-top: 20px;
    margin-bottom: 0;
  }

  @media (min-width: 768px) {
    .infection-name {
      margin-top: 0;
    }
  }
}
</style>
