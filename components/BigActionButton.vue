<template>
  <b-card class="hoverable-card">
    <b-media class="align-items-center">
      <template v-if="image" v-slot:aside class="d-none d-md-block">
        <b-img
          :src="require(`@/assets/images/${image}.png`)"
          :srcset="`${require(`@/assets/images/${image}.png`)}    1x,
                ${require(`@/assets/images/${image}@2x.png`)} 2x`"
          class="mr-3 d-none d-md-block"
        />
      </template>
      <h5 class="mt-0">
        <a :href="url" class="stretched-link">{{ title }}</a>
      </h5>
      <p class="mb-0">{{ subtitle }}</p>
    </b-media>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

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
