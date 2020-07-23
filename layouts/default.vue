<template>
  <div class="wrapper">
    <b-navbar :sticky="true" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="'/' + $i18n.locale + '/'">
        <img
          src="~/assets/images/logo-covid-journal.png"
          srcset="
            ~/assets/images/logo-covid-journal.png    1x,
            ~/assets/images/logo-covid-journal@2x.png 2x
          "
          width="160"
          class="d-inline-block align-top"
        />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <template v-if="role != null">
            <b-nav-item :to="'/' + $i18n.locale + '/user/check-ins'">
              {{ $t('my-check-ins') }}
            </b-nav-item>
            <b-nav-item :to="'/' + $i18n.locale + '/user/profile'">
              {{ $t('my-profile') }}
            </b-nav-item>
          </template>
          <template v-if="role === 'Professional'">
            <b-nav-item :to="'/' + $i18n.locale + '/organization/places'">
              {{ $t('places') }}
            </b-nav-item>
            <b-nav-item :to="'/' + $i18n.locale + '/organization/infections'">
              {{ $t('infections') }}
            </b-nav-item>
          </template>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <template v-if="role">
            <b-nav-item @click="logout"> {{ $t('logout') }} </b-nav-item>
          </template>

          <template v-else>
            <b-nav-text> {{ $t('login-as') }} </b-nav-text>

            <b-nav-item :to="'/' + $i18n.locale + '/login'">
              {{ $t('user') }}
            </b-nav-item>
            <b-nav-item :to="'/' + $i18n.locale + '/login-professional'">
              {{ $t('professional') }}
            </b-nav-item>
          </template>

          <b-nav-item :to="'/' + $i18n.locale + '/legal'">
            {{ $t('legal') }}
          </b-nav-item>

          <b-nav-item
            v-for="locale in $i18n.locales"
            v-if="locale.code !== $i18n.locale"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
          >
            {{ locale.name }}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="main-container">
      <nuxt />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "legal":"Legal Notices",
    "my-check-ins":"My Check-ins",
    "my-profile":"My Profile",
    "places":"Places",
    "infections":"Infections",
    "logout":"Logout",
    "login-as":"Login as:",
    "professional":"Professional",
    "user":"User"
  },
  "fr": {
    "legal":"Mentions légales",
    "my-check-ins":"Mes Check-ins",
    "my-profile":"Mon Profil",
    "places":"Lieux",
    "infections":"Infections",
    "logout":"Se déconnecter",
    "login-as":"Connexion :",
    "professional":"Professionel",
    "user":"Utilisateur"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class DefaultLayout extends Vue {
  role: string | null = null
  $i18n: any

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

    this.$router.replace('/' + this.$i18n.locale + '/')
  }
}
</script>
