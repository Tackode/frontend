<template>
  <div class="content">
    <div class="title">
      <h1>{{ $t('welcome') }}</h1>
      <p>{{ $t('message') }}</p>
    </div>

    <div class="login" v-if="role === null">
      <h2>{{ $t('log') }}</h2>
      <b-button to="/login" variant="primary">
        {{ $t('userlog') }}
      </b-button>

      <b-button to="/login-professional" variant="primary">
        {{ $t('prolog') }}
      </b-button>
      <br />
    </div>

    <div class="checkin">
      <h2>{{ $t('checkin') }}</h2>
      <b-button :to="'/' + $i18n.locale + '/check-in'" variant="primary">
        {{ $t('scan') }}
      </b-button>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "welcome": "Welcome to Covid-Journal",
    "message": "Be aware of Covid in public and private places",
    "log": "Loggin In",
    "logout":"Log Out",
    "checkin" : "Check in a place",
    "scan": "Scan a QR Code",
    "prolog":"Professional log in",
    "userlog":"User log in"
  },
  "fr": {
    "welcome": "Bienvenue sur Covid-Journal",
    "message": "Covid-19 : Soyez alerté dans les lieux visités",
    "log": "Connexion",
    "logout":"Se déconnecter",
    "checkin" : "Enregistrer son passage",
    "scan": "Scanner un QR Code",
    "prolog":"Connexion Pro",
    "userlog":"Connexion Utilisateur"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
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

.title,
.login,
.checkin {
  margin-bottom: 2em;
}
</style>
