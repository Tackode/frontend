<template>
  <Card class="text-center">
    <img
      class="img-fluid"
      src="~/assets/images/email-sent.png"
      srcset="
              ~/assets/images/email-sent.png    1x,
              ~/assets/images/email-sent@2x.png 2x
              ~/assets/images/email-sent@3x.png 3x
            "
    />
    <p class="title-2">{{ $t('checkMail') }}</p>
    <p>
      {{ $t('emailSent', { email }) }}
    </p>
  </Card>
</template>

<i18n>
{
  "en": {
    "emailSent": "An email has been sent to your mailbox {email}. Please, click on the connection link in the mail.",
    "checkMail": "Check your mails"
  },
  "fr": {
    "emailSent": "Nous venons de vous envoyer un mail à l’adresse {email}. Il possède un lien magique qui vous connectera automatiquement !",
    "checkMail": "Vérifier vos mails"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

@Component({
  components: {
    Card: () => import('./Card.vue'),
  },
})
export default class EmailSent extends Vue {
  @Prop({ type: String, required: true }) readonly email!: string
}
</script>
