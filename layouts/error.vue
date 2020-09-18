<template>
  <div class="wrapped-container c-center c-large my-3">
    <div v-if="error.statusCode === 404">
      <h2>{{ $t('notFound') }}</h2>
      <p>{{ $t('error404') }}</p>
    </div>
    <div v-else>
      <h2>{{ $t('errorOccurred') }}</h2>
      <p>{{ $t('tryAgain') }}</p>
    </div>
    <NuxtLink to="/">{{ $t('homePage') }} </NuxtLink>
  </div>
</template>
<i18n>
{
  "en": {
    "notFound":"This page could not be found.",
    "homePage":"Home page",
    "error404":"Error 404",
    "errorOccurred":"An error occurred.",
    "tryAgain":"Try again later",
    "titlePage":"Covid Journal - Error"

  },
  "fr": {
    "notFound":"Cette page n'existe pas.",
    "homePage":"Retour à la page d'accueil",
    "error404":"Erreur 404",
    "errorOccurred":"Une erreur est survenue.",
    "tryAgain":"Veuillez réessayer ultérieurement",
    "titlePage":"Covid Journal - Erreur"
  }
}
</i18n>
<script type="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'

const ErrorLayoutProps = Vue.extend({
  props: {
    error: Object,
  },
})

@Component
export default class ErrorLayout extends ErrorLayoutProps {
  mounted() {
    document.title = this.$i18n.t('titlePage')
  }
}
</script>
