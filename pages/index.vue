<template>
  <div class="container">
    <div>
      <h1>Welcome to Covid Journal!</h1>
      <br />

      <b-button to="/check-in" variant="primary">Do a Check-in</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class Home extends Vue {}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
