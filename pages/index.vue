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

    <div class="wrapped-container c-medium mb-3">
      <h2>{{ $t('checkin') }}</h2>
      <BigActionButton
        :title="$t('register')"
        :subtitle="$t('scan')"
        image="qr-code"
        :url="'/' + $i18n.locale + '/check-in'"
      />

      <hr />

      <template v-if="role == null">
        <h2>{{ $t('log') }}</h2>
        <BigActionButton
          class="mb-3"
          :title="$t('prolog')"
          :subtitle="$t('Intro')"
          image="pro"
          :url="'/' + $i18n.locale + '/login-professional'"
        />
        <BigActionButton
          :title="$t('userlog')"
          :subtitle="$t('places')"
          image="perso"
          :url="'/' + $i18n.locale + '/login'"
        />
      </template>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "register":"Register a place to be notified when an infection is reported",
    "Intro":"Manage your organization and the corresponding places",
    "subtitle":"Manage your organization and corresponding places.",
    "covidjournal": "Covid-Journal",
    "summary": "Check-in and be notified of potential contact with infected people.",
    "log": "Loggin In",
    "logout":"Log Out",
    "checkin" : "Check in a place",
    "scan": "Scan the QR Code of the place where you are",
    "prolog":"You welcome the public and you want to offer Covid-Journal to your visitors",
    "userlog":"You want to know if you have crossed an infected person",
    "places":"Manage your places and your profile"
  },
  "fr": {
    "register":"Enregistrez un lieu de passage pour être informé en cas de signalement d'une infection.",
    "Intro":"Gérez votre organisation et les lieux correspondants.",
    "subtitle":"Gérer votre organisation et les lieux correspondants.",
    "covidjournal": "Bienvenue sur Covid-Journal",
    "summary": "Enregistrez votre passage et soyez notifié d'un contact potentiel avec une personne infectée.",
    "log": "Connexion",
    "logout":"Se déconnecter",
    "checkin" : "Enregistrer son passage",
    "scan": "Scannez le QR Code du lieu dans lequel vous vous trouvez.",
    "prolog":"Vous accueillez du public et vous souhaitez proposer Covid-Journal à vos visiteurs.",
    "userlog":"Vous souhaitez savoir si vous avez croisé une personne infectée.",
    "places":"Gérez vos lieux de passages et votre profil."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import BigActionButton from '~/components/BigActionButton.vue'

@Component({
  components: {
    BigActionButton,
  },
})
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
.checkin {
  margin-bottom: 2em;
}
</style>
