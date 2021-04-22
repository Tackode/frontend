<template>
  <div v-if="state === LoginState.IDLE">
    <div class="wrapped-container c-large c-center my-3">
      <DecoratedCard image="login-drawing" :title="$t(mode)">
        <b-form @submit="handleSubmit" class="form-container">
          <h1 class="text-center">{{ $t(mode) }}</h1>

          <div>
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
              class="professional-switch"
            >
              {{ $t('representOrganization') }}
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
          </div>

          <b-button type="submit" variant="primary" block>
            {{ $t('login-action') }}
          </b-button>
        </b-form>

        <template #decoration>
          <p class="title-1">{{ $t('welcome') }}</p>
          <p class="description">
            {{ $t('appDescription') }}
          </p>
        </template>
      </DecoratedCard>
    </div>
  </div>

  <div
    v-else-if="state === LoginState.CHECK_EMAIL"
    class="wrapped-container c-small c-center my-3"
  >
    <EmailSent :email="email" />
  </div>

  <div
    v-else-if="state === LoginState.LOADING"
    class="wrapped-container c-small c-center my-3 text-center"
  >
    <Loader />
  </div>
</template>

<i18n>
{
  "en": {
    "login": "Login",
    "signup": "Signup",
    "login-action": "Login",
    "neverShare": "We'll never share your email with anyone else.",
    "enterEmail": "Enter your email",
    "email": "Email Address",
    "organizationName": "Organization name",
    "enterOrganizationName": "Enter your organization name",
    "networkError": "A network error has occurred. Please, try again.",
    "welcome": "Welcome !",
    "appDescription": "Tackode allows you to be kept informed whether you met someone infected",
    "representOrganization": "You represent a company"
  },
  "fr": {
    "login": "Connexion",
    "signup": "Inscription",
    "login-action": "Se connecter",
    "neverShare": "Nous ne partagerons pas votre email.",
    "enterEmail": "Entrez votre adresse",
    "email": "Adresse mail",
    "organizationName": "Nom d'entreprise",
    "enterOrganizationName": "Nom de votre entreprise",
    "networkError": "Une erreur réseau est survenue. S'il vous plait, veuillez réessayer.",
    "welcome": "Bienvenue !",
    "appDescription": "L’application Tackode vous permet d’être tenu informé si vous avez croisé une personne infectée",
    "representOrganization": "Vous représentez une société"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { showError } from '../helpers/alerts'
import type { Session } from '../types/Session'

enum LoginState {
  IDLE,
  CHECK_EMAIL,
  LOADING,
}

@Component({
  components: {
    DecoratedCard: () => import('./DecoratedCard.vue'),
    EmailSent: () => import('./EmailSent.vue'),
    Loader: () => import('./Loader.vue'),
  },
})
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
      await this.$axios.$post<Session>('/login', {
        email: this.email,
        role: this.professional ? 'Professional' : 'Public',
        organizationName: this.professional ? this.organizationName : null,
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
  }
}
</script>

<style lang="scss">
.form-container .professional-switch label.custom-control-label {
  font-size: 1rem;
  line-height: 1.8rem;
}
</style>

<style lang="scss" scoped>
.form-container {
  .custom-control {
    margin-bottom: 25px;
    margin-top: 25px;
  }

  h1 {
    margin-bottom: 30px;
  }

  .professional-switch label {
    font-size: 1rem;
  }

  button {
    margin-top: 25px;
  }
}
</style>
