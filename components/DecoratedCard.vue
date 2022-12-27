<template>
  <div
    class="card"
    :style="{
      backgroundImage: `-webkit-image-set(
      url(${require(`~/assets/images/${image}.png`)}) 1x,
      url(${require(`~/assets/images/${image}@2x.png`)}) 2x,
      url(${require(`~/assets/images/${image}@3x.png`)}) 3x
    )`,
    }"
  >
    <div class="main-col">
      <div class="main-content">
        <div class="main-slot">
          <slot />
        </div>
      </div>
    </div>
    <div class="decoration-col d-none d-md-block">
      <div class="decoration-content">
        <slot name="decoration" />
        <img
          :alt="title"
          :src="require(`~/assets/images/${image}.png`)"
          :srcset="`
              ${require(`~/assets/images/${image}.png`)}    1x,
              ${require(`~/assets/images/${image}@2x.png`)} 2x,
              ${require(`~/assets/images/${image}@3x.png`)} 3x
            `"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

@Component
export default class Card extends Vue {
  @Prop({ type: String, required: true }) readonly title!: string
  @Prop({ type: String, required: true }) readonly image!: string
}
</script>

<style lang="scss" scoped>
.card {
  min-height: 75vh;
  border-radius: 8px;
  box-shadow: 0 2px 15px 0 rgba($color: #000000, $alpha: 0.25);
  display: flex;
  flex-direction: row;
  color: $secondary;
  background-color: #ffffff;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom;

  @media (min-width: 768px) {
    min-height: 0;
    height: 567px;
    background: $light;
    background-image: none !important;
  }

  .card-row {
    height: 100%;
  }

  .main-col {
    position: relative;
    flex: 1;
    backdrop-filter: blur(3px);

    @media (min-width: 768px) {
      padding: 24px;
      backdrop-filter: none;
    }

    .main-content {
      height: auto;
      border-radius: 8px;
      padding: 48px 24px;
      display: flex;

      @media (min-width: 768px) {
        height: 100%;
        padding: 24px 50px;
        background-color: #ffffff;
      }

      .main-slot {
        flex: 1;

        @media (min-width: 768px) {
          align-self: center;
        }

        img {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;

          @media (min-width: 768px) {
            display: none;
          }

          @media (max-height: 700px) {
            filter: blur(4px);
          }
        }
      }
    }
  }

  .decoration-col {
    flex: 1;

    .decoration-content {
      position: relative;
      height: 100%;
      background-color: #ffffff;
      border-radius: 0 8px 8px 0;
      padding: 32px 16px;
      text-align: center;

      .description {
        font-size: 1.5rem;
        line-height: normal;
      }

      img {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
  }
}
</style>
