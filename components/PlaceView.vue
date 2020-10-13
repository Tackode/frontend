<template>
  <Card class="place text-center">
    <p class="organization">{{ data.organization.name }}</p>
    <p class="name">{{ data.name }}</p>
    <NlToBr tag="p" :text="data.description" class-name="description" />
  </Card>
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

@Component({
  components: {
    Card: () => import('~/components/Card.vue'),
    NlToBr: () => import('~/components/NlToBr.vue'),
  },
})
export default class PlaceView extends PlaceViewProps {}
</script>

<style lang="scss">
.place {
  .organization,
  .name {
    font-family: $headings-font-family;
    font-weight: 700;
    font-size: 1.7rem;
  }

  .organization,
  .description {
    margin-bottom: 0;
  }

  .name {
    color: $primary;
    margin-top: -7px;
  }

  .description {
    font-size: 1rem;
    margin-bottom: 0;
  }
}
</style>
