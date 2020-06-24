<template>
  <div>
    <b-navbar :sticky="true" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img
          src="./Logo.jpg"
          height="30"
          width="30"
          class="d-inline-block align-top"
        />
        Covid Journal</b-navbar-brand
      >

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <template v-if="role === 'Public'">
            <b-nav-item to="/guest/check-ins"> {{ $t('check') }} </b-nav-item>
            <b-nav-item to="/guest/profile"> {{ $t('profil') }} </b-nav-item>
          </template>
          <template v-if="role === 'Professional'">
            <b-nav-item to="/professional/places">
              {{ $t('place') }}
            </b-nav-item>
            <b-nav-item to="/professional/infections">
              {{ $t('inf') }}
            </b-nav-item>
            <b-nav-item to="/professional/check-ins">
              {{ $t('chec') }}
            </b-nav-item>
            <b-nav-item to="/professional/profile">
              {{ $t('profi') }}
            </b-nav-item>
          </template>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <template v-if="role">
            <b-nav-item @click="logout"> {{ $t('logout') }} </b-nav-item>
          </template>
          <template v-else>
            <b-nav-text> {{ $t('log') }} </b-nav-text>

            <b-nav-item to="/login"> {{ $t('user') }} </b-nav-item>
            <b-nav-item to="/login-professional"> {{ $t('pro') }} </b-nav-item>
          </template>
          <nuxt-link
            v-for="locale in $i18n.locales"
            v-if="locale.code !== $i18n.locale"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
            >{{ locale.name }}</nuxt-link
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "check":"My Check-ins",
    "profil":"My Profile",
    "place":"Places",
    "inf":"Infections",
    "profi":"Profile",
    "logout":"Logout",
    "log":"Login as:",
    "pro":"Professional",
    "user":"User",
    "chec":"Check-Ins"
  },
  "fr": {
    "check":"Mes Check-ins",
    "profil":"Mon Profil",
    "place":"Lieux",
    "inf":"Infections",
    "profi":"Profil",
    "logout":"Se déconnecter",
    "log":"Connexion comme :",
    "pro":"Professionel",
    "user":"Utilisateur",
    "chec":"Check-Ins"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class DefaultLayout extends Vue {
  role: string | null = null

  created() {
    // Init store
    this.$store.dispatch('session/init')
  }

  mounted() {
    this.role = this.$store.getters['session/role']

    this.$store.watch(
      (store) => store.session.role,
      (role) => {
        this.role = role
      }
    )
  }

  logout(e: Event) {
    e.preventDefault()

    this.$store.dispatch('session/logout')

    this.$router.replace('/')
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
