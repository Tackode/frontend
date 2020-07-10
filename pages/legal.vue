<template>
  <div class="wrapped-container container login">
    <h2>{{ $t('legal-noticies') }}</h2>
    <p>En vigueur au 10/07/2020</p>
    <p>
      Conformément aux dispositions des Articles 6-III et 19 de la Loi
      n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique,
      dite L.C.E.N., il est porté à la connaissance des Utilisateurs du site
      covid-journal.org les présentes mentions légales. La connexion et la
      navigation sur le site covid-journal.org par l’Utilisateur implique
      acceptation intégrale et sans réserve des présentes mentions légales. Ces
      dernières sont accessibles sur le site à la rubrique « Mentions légales ».
    </p>
    <h5>ARTICLE 1 : L’ÉDITEUR</h5>
    <p>
      L'édition du site Covid-Journal est assurée par la Société Creatiwity dont
      le siège social est situé au 1 rue de Savoie, Paris 75006.
    </p>

    <h5>ARTICLE 2 : L’HÉBERGEUR</h5>
    <p>
      L'hébergeur du site Covid-Journal est la Société OVH, dont le siège social
      est situé au 2 rue Kellermann - 59100 Roubaix - France.
    </p>
    <h5>ARTICLE 3 : ACCÈS AU SITE</h5>
    <p>
      Le site est accessible par tout endroit, 7j/7, 24h/24 sauf cas de force
      majeure, interruption programmée ou non et pouvant découlant d’une
      nécessité de maintenance. En cas de modification, interruption ou
      suspension des services le site Covid-Journal ne saurait être tenu
      responsable.
    </p>
    <h5>ARTICLE 4 : COLLECTE DES DONNÉES</h5>
    <p>
      Le site assure à l'Utilisateur une collecte et un traitement
      d'informations personnelles dans le respect de la vie privée conformément
      à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers
      et aux libertés. Le site est déclaré à la CNIL sous le numéro
      ________________. En vertu de la loi Informatique et Libertés, en date du
      6 janvier 1978, l'Utilisateur dispose d'un droit d'accès, de
      rectification, de suppression et d'opposition de ses données personnelles.
      L'Utilisateur exerce ce droit :
    </p>
    <p>Par mail : ________________</p>
    <h5>ARTICLE 5 : COOKIES</h5>
    <p>
      L’Utilisateur est informé que lors de ses visites sur le site, un cookie
      peut s’installer automatiquement sur son logiciel de navigation. En
      naviguant sur le site, il les accepte. Un cookie est un élément qui ne
      permet pas d’identifier l’Utilisateur mais sert à enregistrer des
      informations relatives à la navigation de celui-ci sur le site Internet.
      L’Utilisateur pourra désactiver ce cookie par l’intermédiaire des
      paramètres figurant au sein de son logiciel de navigation.
    </p>
    <h5>ARTICLE 6 : PROPRIÉTÉ INTELLECTUELLE</h5>
    <p>
      Toute utilisation, reproduction, diffusion, commercialisation,
      modification de toute ou partie du site covid-journal.org, sans
      autorisation de l’Editeur est prohibée et pourra entraînée des actions et
      poursuites judiciaires telles que notamment prévues par le Code de la
      propriété intellectuelle et le Code civil.
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "legal-noticies":"Legal Noticies"
  },
  "fr": {
  "legal-noticies":"Mentions légales"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Legal extends Vue {}
</script>

<style></style>
