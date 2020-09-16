<template>
  <div class="wrapper">
    <b-navbar :sticky="true" toggleable="lg" type="light" variant="light">
      <b-navbar-brand :to="'/' + $i18n.locale + '/'">
        <img
          src="~/assets/images/logo-covid-journal.png"
          srcset="
            ~/assets/images/logo-covid-journal.png    1x,
            ~/assets/images/logo-covid-journal@2x.png 2x
            ~/assets/images/logo-covid-journal@3x.png 3x
          "
          width="230"
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
            <b-nav-item :to="'/' + $i18n.locale + '/login'">
              {{ $t('log-in') }}
            </b-nav-item>
            <b-nav-item :to="'/' + $i18n.locale + '/signin'">
              {{ $t('sign-in') }}
            </b-nav-item>
          </template>

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

    <b-navbar tag="footer" :sticky="true" type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item :to="'/' + $i18n.locale + '/legal'">
          {{ $t('legal-notices') }}
        </b-nav-item>
        <b-nav-item href="https://facebook.com">
          <img
            src="~/assets/images/facebook.png"
            srcset="
              ~/assets/images/facebook.png    1x,
              ~/assets/images/facebook@2x.png 2x
              ~/assets/images/facebook@3x.png 3x
            "
          />
        </b-nav-item>
        <b-nav-item href="https://instagram.com">
          <img
            src="~/assets/images/instagram.png"
            srcset="
              ~/assets/images/instagram.png    1x,
              ~/assets/images/instagram@2x.png 2x
              ~/assets/images/instagram@3x.png 3x
            "
          />
        </b-nav-item>
        <b-nav-item href="https://twitter.com">
          <img
            src="~/assets/images/twitter.png"
            srcset="
              ~/assets/images/twitter.png    1x,
              ~/assets/images/twitter@2x.png 2x
              ~/assets/images/twitter@3x.png 3x
            "
          />
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-text>&copy; 2020 Covid-Journal</b-nav-text>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<i18n>
{
  "en": {
    "legal-notices":"Legal Notices",
    "my-check-ins":"My Check-ins",
    "my-profile":"My Profile",
    "places":"Places",
    "infections":"Infections",
    "logout":"Logout",
    "log-in":"Log in",
    "sign-in":"Sign in"
  },
  "fr": {
    "legal-notices":"Mentions légales",
    "my-check-ins":"Mes Visites",
    "my-profile":"Mon Profil",
    "places":"Lieux",
    "infections":"Infections",
    "logout":"Se déconnecter",
    "log-in":"Se connecter",
    "sign-in":"S'inscrire"
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

<style>
.navbar {
  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.25);
}

footer.navbar {
  bottom: 0;
}
</style>
