<template>
  <b-button class="container medium-container" :to="url" variant="secondary">
    <b-row>
      <img :src="src" :srcset="srcset" class="mr-3" />
      <b-col class="text-center" align-self="center">
        <h5 class="mt-0">{{ title }}</h5>
        <p>
          {{ subtitle }}
        </p>
      </b-col>
    </b-row>
  </b-button>
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
    src: String,
    srcset: String,
  },
})

@Component
export default class BigActionButton extends BigButtonProps {}
</script>
