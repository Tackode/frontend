<template>
  <b-card class="hoverable-card">
    <ul class="no-dot">
      <b-media tag="li" class="align-items-center">
        <template v-if="image" v-slot:aside>
          <b-img
            :src="require(`@/assets/images/${image}.png`)"
            :srcset="`${require(`@/assets/images/${image}.png`)}    1x,
                ${require(`@/assets/images/${image}@2x.png`)} 2x`"
            class="btn-icon"
          />
        </template>
        <h5 class="mt-0">
          <nuxt-link v-if="url" :to="url" class="stretched-link">{{
            title
          }}</nuxt-link>
          <p v-else>{{ title }}</p>
        </h5>
        <p class="mb-0 subtitle">{{ subtitle }}</p>
      </b-media>
      <b-media tag="li" class="align-items-center subtitle-responsive">
        <p class="mb-0">{{ subtitle }}</p>
      </b-media>
    </ul>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'

// Define the props by using Vue's canonical way.
const BigButtonProps = Vue.extend({
  props: {
    title: String,
    subtitle: String,
    url: String,
    image: {
      type: String,
      required: false,
    },
  },
})

@Component
export default class BigActionButton extends BigButtonProps {}
</script>

<style lang="scss">
.btn-icon {
  max-width: 80px;
  max-height: 80px;
}

.no-dot {
  padding: 0;
  list-style-type: none;
}

.hoverable-card {
  a {
    color: rgb(33, 37, 41);

    &:hover {
      text-decoration: none;
    }
  }

  @media (min-width: 576px) {
    .subtitle-responsive {
      display: none;
    }
  }

  @media (max-width: 576px) {
    .btn-icon {
      max-width: 60px;
      max-height: 60px;
    }

    .subtitle {
      display: none;
    }
  }
}
</style>
