<template>
  <div class="container">
    <div v-if="(state = HomeState.LOADED)">
      <br />
      <br />

      <h1>{{ $t('welcome') }}</h1>
      {{ $t('message') }}
      <br />
      <div v-if="role === null">
        <h2>{{ $t('log') }}</h2>
        <b-button to="/login" variant="primary"> {{ $t('userlog') }} </b-button>

        <b-button to="/login-professional" variant="primary">
          {{ $t('prolog') }}
        </b-button>
        <br />
      </div>
      <div v-else>
        <br />
        <b-button variant="primary" @click="$store.dispatch('session/logout')">
          {{ $t('logout') }}</b-button
        >
      </div>

      <br />
      <h2>{{ $t('checkin') }}</h2>
      {{ $t('scan') }}
      <br />
      <br />
      <b-button to="/check-in" variant="primary">{{ $t('check') }}</b-button>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "welcome": "Welcome to Covid Journal!",
    "message": "Be aware of Covid in public and private places",
    "log": "Loggin In",
    "logout":"Log Out",
    "checkin" : "Check in a place",
    "scan": "Scan a QR Code",
    "check":"Do a Check-in",
    "prolog":"Professional log in",
    "userlog":"User log in"
  },
  "fr": {
    "welcome": "Bienvenue sur Covid Journal!",
    "message": "Covid-19 : Soyez alerté dans les lieux visités",
    "log": "Se connecter",
    "logout":"Se déconnecter",
    "checkin" : "Scanner votre entrée",
    "scan": "Scanner un QR Code",
    "check":"Faire un Check-in",
    "prolog":"Connexion Pro",
    "userlog":"Connexion utilisateur"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
enum HomeState {
  IDLE,
  LOADED,
}
@Component({})
export default class Home extends Vue {
  state: HomeState = HomeState.IDLE
  role: string | null = null
  HomeState = HomeState
  mounted() {
    this.role = this.$store.getters['session/role']

    this.$store.watch(
      (store) => store.session.role,
      (role) => {
        this.role = role
      }
    )
    this.state = HomeState.LOADED
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
