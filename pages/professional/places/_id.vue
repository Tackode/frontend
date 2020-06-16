<template>
  <div>
    <nuxt-link class="no-print" to="/professional/places/">Back</nuxt-link>
    <br />

    <qrcode :value="qrCodeUrl" :options="{ width: 400 }"></qrcode>
    <br />
    <a href="javascript:window.print()"
      ><b-button class="no-print">Print the page</b-button></a
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class PlaceDetail extends Vue {
  placeId: string | null = null

  mounted() {
    this.placeId = this.$route.params.id
  }

  get qrCodeUrl() {
    return (this as any).$env.FRONT_URL + '/check-in?placeId=' + this.placeId
  }
}
</script>

<style>
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
  canvas {
    width: 800px !important;
    height: 800px !important;
  }
}
</style>
