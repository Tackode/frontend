<template>
  <b-row class="sign-row" cols="1" cols-sm="1" cols-md="1" cols-lg="2">
    <b-col class="form">
      <b-form v-if="state === LoginState.IDLE" @submit="handleSubmit">
        <h1>{{ mode === 'login' ? 'Connexion' : 'Inscription' }}</h1>

        <b-form-group
          :label="$t('email')"
          label-for="login-email"
          :description="$t('neverShare')"
        >
          <b-form-input
            id="login-email"
            v-model="email"
            type="email"
            required
            :placeholder="$t('enterEmail')"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox
          v-if="mode === 'signup'"
          v-model="professional"
          name="check-button"
          switch
          size="lg"
        >
          Vous représentez une société
        </b-form-checkbox>

        <b-form-group
          v-if="professional"
          :label="$t('organizationName')"
          label-for="login-organization-name"
        >
          <b-form-input
            id="login-organization-name"
            v-model="organizationName"
            required
            :placeholder="$t('enterOrganizationName')"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" block>
          {{ $t('login') }}
        </b-button>
      </b-form>

      <p v-else-if="state === LoginState.CHECK_EMAIL">
        {{ $t('emailSent') }}
      </p>
      <p v-else-if="state === LoginState.LOADING">
        {{ $t('loading') }}
      </p>
    </b-col>
    <b-col class="text">
      <p class="title-1">Bienvenue !</p>
      <p class="description">
        L’application Covid-Journal vous permet d’être tenu informé si vous avez
        croisé une personne infectée
      </p>
    </b-col>
  </b-row>
</template>

<i18n>
{
  "en": {
    "loading": "Loading. Please wait...",
    "emailSent": "An email has been sent to your mailbox. Please, click on the connection link in the mail.",
    "login": "Login",
    "neverShare": "We'll never share your email with anyone else.",
    "enterEmail": "Enter your email",
    "email": "Email Address",
    "organizationName": "Organization name",
    "enterOrganizationName": "Enter your organization name",
    "networkError": "A network error has occurred. Please, try again."
  },
  "fr": {
    "loading": "Chargement en cours...",
    "emailSent": "Un e-mail a été envoyé dans votre boîte mail. Veuillez cliquer sur le lien dans l'e-mail pour vous connecter.",
    "login": "Se connecter",
    "neverShare": "Nous ne partagerons pas votre email.",
    "enterEmail": "Entrez votre adresse",
    "email": "Adresse mail",
    "organizationName": "Nom d'entreprise",
    "enterOrganizationName": "Nom de votre entreprise",
    "networkError": "Une erreur réseau est survenue. S'il vous plait, veuillez réessayer."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { showError } from '../../helpers/alerts'

enum LoginState {
  IDLE,
  CHECK_EMAIL,
  LOADING,
}

@Component
export default class LoginFrame extends Vue {
  @Prop({ type: String, required: true }) readonly mode!: string

  state: LoginState = LoginState.IDLE
  email: string = ''
  organizationName: string = ''
  professional: boolean = false

  // Bind enum for Vue
  LoginState = LoginState

  async handleSubmit(e: Event) {
    e.preventDefault()

    this.state = LoginState.LOADING

    try {
      await this.$axios.$post('/login', {
        email: this.email,
        role: this.professional ? 'Professional' : 'Public',
        organizationName:
          this.mode === 'Professional' ? this.organizationName : null,
        fallbackOnSignUp: this.mode === 'signup',
      })
    } catch (error) {
      this.state = LoginState.IDLE

      showError(
        this.$bvToast,
        'Connexion',
        new Error(this.$i18n.t('networkError') as string)
      )
      return
    }

    this.state = LoginState.CHECK_EMAIL

    this.$store.dispatch('session/setLocalEmail', this.email)
  }
}
</script>

<style lang="scss">
.sign-row {
  margin-top: 100px;
  box-shadow: 0 2px 35px 0 rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  .form {
    padding: 25px;
    color: #444444;

    form {
      padding: 120px 60px 175px 60px;
      background: white;
      border-radius: 8px;

      .custom-control {
        margin-bottom: 25px;
        margin-top: 25px;
      }

      h1 {
        margin-bottom: 30px;
      }

      .form-group {
        label {
          text-align: left;
        }

        .text-muted {
          text-align: left;
        }
      }

      button {
        margin-top: 25px;
      }
    }
  }

  .text {
    padding: 50px 15px;
    background: white;
    color: #444444;
    background-image: image-set(
      '~assets/images/login-drawing.png' 1x,
      '~assets/images/login-drawing@2x.png' 2x,
      '~assets/images/login-drawing@3x.png' 3x
    );
    background-repeat: no-repeat;
    background-position: bottom;
    border-radius: 8px;

    .description {
      font-size: 1.5rem;
      line-height: normal;
    }
  }

  @media (max-width: 991.98px) {
    margin: 0 25px 0px 25px;

    .form {
      padding: 0;

      form {
        padding: 25px 15px 25px 15px;
      }
    }

    .text {
      min-height: 325px;

      p {
        display: none;
      }
    }
  }

  @media (max-width: 575.98px) {
    margin: 0;
  }
}
</style>
