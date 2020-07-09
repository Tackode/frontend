<template>
  <div class="content">
    <div class="title">
      <h1 class="d-none">{{ $t('covidjournal') }}</h1>
      <img
        :alt="$t('covidjournal')"
        class="img-fluid logo"
        src="~/assets/images/logo-covid-journal-big.png"
        srcset="
          ~/assets/images/logo-covid-journal-big.png    1x,
          ~/assets/images/logo-covid-journal-big@2x.png 2x
        "
      />
      <p>{{ $t('summary') }}</p>
    </div>

    <p class="image-caption">
      Photo by
      <a
        href="https://unsplash.com/@jonwaits?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        >Jonathan Nguyen</a
      >
      on
      <a
        href="https://unsplash.com/s/photos/covid-restaurant?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
        >Unsplash</a
      >
    </p>

    <div class="wrapped-container container">
      <b-card :title="$t('checkin')" tag="checkin" class="checkin mb-2 w-100">
        <b-button
          class="container"
          :to="'/' + $i18n.locale + '/check-in'"
          variant="light"
        >
          <b-row>
            <b-col sm="2">
              <img
                left
                alt="coucou"
                class="small-container"
                src="~/assets/images/qr-code.png"
                srcset="
                  ~/assets/images/qr-code.png    1x,
                  ~/assets/images/qr-code@2x.png 2x
                "
              />
            </b-col>
            <b-col class="text-center" sm="10">
              <h3>{{ $t('register') }}</h3>
              {{ $t('scan') }}
            </b-col>
          </b-row>
        </b-button>
      </b-card>
      <b-card
        v-if="role === null"
        :title="$t('log')"
        tag="login"
        class="login mb-2 w-100"
      >
        <p>{{ $t('Intro') }}</p>
        <b-button to="/login-professional" class="container" variant="primary">
          {{ $t('prolog') }}
        </b-button>

        <b-button to="/login" class="container" variant="primary">
          {{ $t('userlog') }}
        </b-button>
      </b-card>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "register":"REGISTER",
    "Intro":"If you are professional",
    "subtitle":"Manage your organization and corresponding places.",
    "covidjournal": "Covid-Journal",
    "summary": "Check-in and be notified of potential contact with infected people",
    "log": "Loggin In",
    "logout":"Log Out",
    "checkin" : "Check in a place",
    "scan": "Scan a QR Code",
    "prolog":"Professional log in",
    "userlog":"User log in"
  },
  "fr": {
    "register":"S'ENREGISTRER",
    "Intro":"Vous accueillez du public et vous souhaitez proposer Covid-Journal à vos visiteurs.",
    "subtitle":"Gérer votre organisation et les lieux correspondants.",
    "covidjournal": "Bienvenue sur Covid-Journal",
    "summary": "Enregistrez votre passage et soyez notifié d'un contact potentiel avec une personne infectée",
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

<style lang="scss">
.title {
  height: 30vh;
  background-image: url('~assets/images/background.jpg');
  background-size: cover;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .logo {
    max-width: 500px;
    width: 80vw;
  }

  p {
    color: white;
    max-width: 600px;
    font-size: 1.1em;

    @media (min-width: 768px) {
      font-size: 1.5em;
    }
  }
}

.image-caption {
  font-size: 8px;
}

.image-caption,
.login,
.checkin {
  margin-bottom: 2em;
}
</style>
