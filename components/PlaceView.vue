<template>
  <b-card class="place">
    <p class="organization">{{ data.organization.name }}</p>
    <p class="name">{{ data.name }}</p>
    <p class="description">{{ data.description }}</p>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'

// Define the props by using Vue's canonical way.
const PlaceViewProps = Vue.extend({
  props: {
    data: Object,
  },
})

@Component
export default class PlaceView extends PlaceViewProps {}
</script>

<style lang="scss">
.place {
  .organization,
  .name {
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    font-size: 1.7rem;
  }

  .organization,
  .description {
    margin-bottom: 0;
  }

  .name {
    color: #777;
    margin-top: -7px;
  }

  .description {
    font-size: 1rem;
    margin-bottom: 0;
  }
}
</style>
