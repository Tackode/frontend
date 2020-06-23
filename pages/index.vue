<template>
  <div class="container">
    <div>
      <br />
      <br />
      <h1>Welcome to Covid Journal!</h1>
      Be aware of Covid in public and private places
      <br />
      <div v-if="role === null">
        <h2>Loggin In</h2>
        <b-button to="/login" variant="primary">User log in</b-button>

        <b-button to="/login-professional" variant="primary"
          >Professional log in</b-button
        >
        <br />
      </div>
      <div v-else>
        <br />
        <b-button @click="$store.dispatch('session/logout')" variant="primary"
          >Log out</b-button
        >
      </div>

      <br />
      <h2>Check in a place</h2>
      Scan a QR Code
      <br />
      <br />
      <b-button to="/check-in" variant="primary">Do a Check-in</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class Home extends Vue {
  role: string | null = null

  mounted() {
    this.role = this.$store.getters['session/role']

    this.$store.watch(
      (store) => store.session.role,
      (role) => {
        this.role = role
      }
    )
  }
}
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
