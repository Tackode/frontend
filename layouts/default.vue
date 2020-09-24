<template>
  <div class="wrapper">
    <div class="main-container">
      <b-navbar :sticky="true" toggleable="lg" type="light" variant="light">
        <b-navbar-brand :to="localePath('/')">
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
              <b-nav-item :to="localePath('/user/check-ins')">
                {{ $t('my-check-ins') }}
              </b-nav-item>
              <b-nav-item :to="localePath('/user/profile')">
                {{ $t('my-profile') }}
              </b-nav-item>
            </template>
            <template v-if="role === 'Professional'">
              <b-nav-item :to="localePath('/organization/places')">
                {{ $t('places') }}
              </b-nav-item>
              <b-nav-item :to="localePath('/organization/infections')">
                {{ $t('infections') }}
              </b-nav-item>
            </template>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <template v-if="role">
              <b-nav-item @click="logout"> {{ $t('logout') }} </b-nav-item>
            </template>

            <template v-else>
              <b-nav-item :to="localePath('/login')">
                {{ $t('log-in') }}
              </b-nav-item>
              <b-nav-item :to="localePath('/signup')">
                {{ $t('sign-in') }}
              </b-nav-item>
            </template>

            <b-nav-item-dropdown :text="$i18n.t('lang')" right>
              <b-dropdown-item
                v-for="locale in $i18n.locales"
                :key="locale.code"
                :disabled="locale.code === $i18n.locale"
                :to="switchLocalePath(locale.code)"
                >{{ locale.name }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <nuxt />

      <div class="footer-push"></div>
    </div>

    <b-navbar tag="footer" type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item :to="localePath('/legal')">
          {{ $t('legal-notices') }}
        </b-nav-item>
        <b-nav-item
          href="https://www.facebook.com/Creatiwity"
          target="_blank"
          class="footer-icon"
        >
          <img
            src="~/assets/images/facebook.png"
            srcset="
              ~/assets/images/facebook.png    1x,
              ~/assets/images/facebook@2x.png 2x
              ~/assets/images/facebook@3x.png 3x
            "
          />
        </b-nav-item>
        <b-nav-item
          href="https://twitter.com/CreatiwitySAS"
          target="_blank"
          class="footer-icon"
        >
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
    "legal-notices": "Legal Notices",
    "my-check-ins": "My Check-ins",
    "my-profile": "My Profile",
    "places": "Places",
    "infections": "Infections",
    "logout": "Logout",
    "log-in": "Log in",
    "sign-in": "Sign in",
    "lang": "Lang"
  },
  "fr": {
    "legal-notices": "Mentions légales",
    "my-check-ins": "Mes Visites",
    "my-profile": "Mon Profil",
    "places": "Lieux",
    "infections": "Infections",
    "logout": "Se déconnecter",
    "log-in": "Se connecter",
    "sign-in": "S'inscrire",
    "lang": "Langue"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'

@Component({
  head(this: DefaultLayout) {
    return this.$nuxtI18nSeo()
  },
})
export default class DefaultLayout extends Vue {
  role: string | null = null

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

    this.$router.replace(this.localePath('/'))
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
