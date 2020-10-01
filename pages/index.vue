<template>
  <div class="content">
    <div class="title">
      <h1 class="sr-only">Covid-Journal</h1>
      <img
        alt="Covid-Journal"
        class="img-fluid logo"
        src="~/assets/images/logo-covid-journal-big.png"
        srcset="
          ~/assets/images/logo-covid-journal-big.png    1x,
          ~/assets/images/logo-covid-journal-big@2x.png 2x,
          ~/assets/images/logo-covid-journal-big@3x.png 3x
        "
      />
      <p class="d-none d-md-block">{{ $t('summary') }}</p>
    </div>

    <p class="image-caption">
      Photo by
      <a
        href="https://unsplash.com/@itshoobastank?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        target="_blank"
      >
        Shirota Yuri
      </a>
      on
      <a
        href="https://unsplash.com?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        target="_blank"
      >
        Unsplash
      </a>
    </p>

    <div class="wrapped-container c-medium mb-3">
      <p class="d-md-none">{{ $t('summary') }}</p>

      <h2 class="title-1">{{ $t('how-does-it-work') }}</h2>

      <b-row cols="2" class="presentation-block">
        <b-col align-self="end" class="text-left">
          <h3>{{ $t('step-1-title') }}</h3>
          <p>{{ $t('step-1') }}</p>
          <b-button variant="default" block :to="createQrCodeUrl">
            {{ $t('create-qr-code') }}
          </b-button>
        </b-col>
        <b-col>
          <img
            class="img-fluid"
            :alt="$t('step-1-title')"
            src="~/assets/images/step-1.png"
            srcset="
              ~/assets/images/step-1.png    1x,
              ~/assets/images/step-1@2x.png 2x,
              ~/assets/images/step-1@3x.png 3x
            "
          />
        </b-col>
      </b-row>

      <b-row cols="2" class="presentation-block">
        <b-col>
          <img
            class="img-fluid"
            :alt="$t('step-2-title')"
            src="~/assets/images/step-2.png"
            srcset="
              ~/assets/images/step-2.png    1x,
              ~/assets/images/step-2@2x.png 2x,
              ~/assets/images/step-2@3x.png 3x
            "
          />
        </b-col>
        <b-col align-self="end" class="text-left">
          <h3>{{ $t('step-2-title') }}</h3>
          <p>{{ $t('step-2') }}</p>
          <b-button variant="default" block :to="localePath('/check-in/')">
            {{ $t('scan-qr-code') }}
          </b-button>
        </b-col>
      </b-row>

      <b-row cols="2" class="presentation-block">
        <b-col align-self="end" class="text-left">
          <h3>{{ $t('step-3-title') }}</h3>
          <p>{{ $t('step-3') }}</p>
        </b-col>
        <b-col>
          <img
            class="img-fluid"
            :alt="$t('step-3-title')"
            src="~/assets/images/step-3.png"
            srcset="
              ~/assets/images/step-3.png    1x,
              ~/assets/images/step-3@2x.png 2x,
              ~/assets/images/step-3@3x.png 3x
            "
          />
        </b-col>
      </b-row>

      <h2 class="title-1">{{ $t('how-much-does-it-cost') }}</h2>

      <p class="text-justify">{{ $t('cost-paragraph-1') }}</p>
      <p class="text-justify">{{ $t('cost-paragraph-2') }}</p>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "summary": "Check-in by scanning a QR Code and be notified of potential contact with infected people.",
    "how-does-it-work": "How does it work?",
    "how-much-does-it-cost": "How much does it cost?",
    "step-1-title": "Step 1",
    "step-1": "The owner creates a QR Code, which he then makes available to his customers",
    "create-qr-code": "Create a QR Code",
    "step-2-title": "Step 2",
    "step-2": "You scan the QR Code using your smartphone's camera or using the dedicated page of this site",
    "scan-qr-code": "Scan a QR Code",
    "step-3-title": "Step 3",
    "step-3": "You are notified by email if you have met a person infected with Covid-19 in this establishment",
    "cost-paragraph-1": "The coronavirus is eveyone's business, which means each of us must make an effort so that we can all come out of this global pandemic together.",
    "cost-paragraph-2": "It is for this reason that we have decided for the moment to offer our application free of charge to all people who wish to use it and thus allow as many people as possible to be able to go out and enjoy it in complete safety!",

    "register": "Register a place to be notified when an infection is reported",
    "introduction": "Manage your organization and the corresponding places",
    "subtitle": "Manage your organization and corresponding places.",
    "login": "Loggin In",
    "logout": "Log Out",
    "checkin" : "Check in a place",
    "scan": "Scan the QR Code of the place where you are",
    "proLogin": "You welcome the public and you want to offer Covid-Journal to your visitors",
    "userLogin": "You want to know if you have crossed an infected person",
    "places": "Manage your places and your profile",
    "titlePage": "Be notified when an infection is reported"
  },
  "fr": {
    "summary": "Enregistrez votre passage dans un établissement grâce à un QR Code et soyez notifié d'un contact potentiel avec une personne infectée",
    "how-does-it-work": "Comment ça marche ?",
    "how-much-does-it-cost": "Combien ça coûte ?",
    "step-1-title": "Étape 1",
    "step-1": "Le propriétaire de l'établissement crée un QR Code, qu'il met ensuite à la disposition de ses clients",
    "create-qr-code": "Créer un QR Code",
    "step-2-title": "Étape 2",
    "step-2": "Vous scannez le QR Code depuis la caméra de votre téléphone ou depuis la page dédiée sur notre site",
    "scan-qr-code": "Scanner un QR Code",
    "step-3-title": "Étape 3",
    "step-3": "Vous êtes notifié par mail si vous avez croisé une personne infectée par le Covid-19 dans cet établissement",
    "cost-paragraph-1": "Le coronavirus est l'affaire de tous, ce qui signifie que chacun d'entre nous doit faire un effort pour que nous puissions sortir tous ensemble de cette pandémie mondiale.",
    "cost-paragraph-2": "C'est pour cette raison que nous avons décidé pour le moment d'offrir gratuitement notre application à toutes les personnes qui souhaitent en profiter et de permettre ainsi à un maximum de personnes de pouvoir sortir et profiter en toute sécurité !",

    "register": "Enregistrez un lieu de passage pour être informé en cas de signalement d'une infection.",
    "introduction": "Gérez votre organisation et les lieux correspondants.",
    "subtitle": "Gérer votre organisation et les lieux correspondants.",
    "login": "Connexion",
    "logout": "Se déconnecter",
    "checkin" : "Enregistrer son passage",
    "scan": "Scannez le QR Code du lieu dans lequel vous vous trouvez.",
    "proLogin": "Vous accueillez du public et vous souhaitez proposer Covid-Journal à vos visiteurs.",
    "userLogin": "Vous souhaitez savoir si vous avez croisé une personne infectée.",
    "places": "Gérez vos lieux de passages et votre profil.",
    "titlePage": "Soyez informé d'un contact avec une personne contaminée"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'

@Component({
  head(this: Home) {
    return {
      title: this.$i18n.t('titlePage') as string,
    }
  },
})
export default class Home extends Vue {
  role: string | null = null

  get createQrCodeUrl() {
    if (this.role == null) {
      return this.localePath('/signup/')
    } else if (this.role !== 'Professional') {
      this.$store.commit('session/logout')
      return this.localePath('/signup/')
    } else {
      return this.localePath('/organization/places/')
    }
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
}
</script>

<style lang="scss">
.title {
  height: 15vh;
  min-height: 150px;
  background-image: url('~assets/images/background.jpg');
  background-size: cover;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  margin: 24px 24px 0;
  border-radius: 4px;

  @media (min-width: 768px) {
    height: 30vh;
    min-height: 300px;
  }

  .logo {
    max-width: 500px;
    width: 80vw;
    margin-bottom: 0.5rem;
  }

  p {
    color: white;
    max-width: 600px;
    font-size: 1.1em;
    text-shadow: 0 3px 6px #000;

    @media (min-width: 768px) {
      font-size: 1.5em;
    }
  }
}

.image-caption {
  font-size: 8px;
  margin: 0 24px 24px;

  &,
  a {
    color: #444444;
  }
}

.image-caption,
.checkin {
  margin-bottom: 2em;
}

.presentation-block {
  margin-bottom: 3rem;
}
</style>
