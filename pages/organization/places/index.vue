<template>
  <div class="wrapped-container container center-div medium-container">
    <h1 class="sr-only subtitle">Places</h1>
    <h2 class="subtitle">{{ $t('place') }}</h2>
    <BigActionButton
      v-b-modal.place-creation-modal
      class="margin-top"
      @click="PlacetoCreate()"
      :title="$t('cplace')"
      :subtitle="$t('subtitle')"
    />

    <b-table
      class="margin-top"
      v-if="places.length > 0"
      striped
      hover
      :fields="fields"
      :items="places"
    >
      <template v-slot:cell(place_name)="data">
        {{ data.item.name }}
      </template>

      <template v-slot:cell(average_duration)="data">
        {{ data.item.averageDuration }} minutes
      </template>

      <template v-slot:cell(action)="data">
        <nuxt-link
          :to="'/' + $i18n.locale + '/organization/places/' + data.item.id"
        >
          {{ $t('showqr') }}
        </nuxt-link>
      </template>
      <template v-slot:cell(modify)="data">
        <b-button
          v-b-modal.place-creation-modal
          variant="outline-secondary"
          class="mb-2"
          @click="
            PlacetoModify(
              data.item.id,
              data.item.name,
              data.item.description,
              data.item.averageDuration
            )
          "
        >
          <b-icon icon="pencil"></b-icon>
        </b-button>
      </template>

      <template v-slot:cell(delete)="data">
        <b-button
          v-b-modal.place-delete-modal
          variant="outline-secondary"
          class="mb-2"
          @click="place = data.item.id"
        >
          <b-icon icon="trash"></b-icon>
        </b-button>
      </template>
    </b-table>
    <p v-else>
      {{ $t('noplace') }}
    </p>

    <b-modal id="place-creation-modal" :title="$t(FormTitle())">
      <b-form @submit="handleplaceFormValuesSubmit">
        <b-form-group :label="$t('name')" label-for="place-name">
          <b-form-input
            id="place-name"
            v-model="placeFormValues.name"
            required
            :placeholder="$t('nom')"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Description" label-for="place-description">
          <b-form-input
            id="place-description"
            v-model="placeFormValues.description"
            placeholder="Description"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('duration')"
          label-for="place-average-duration"
        >
          <b-form-input
            id="place-average-duration"
            v-model="placeFormValues.averageDuration"
            required
            :placeholder="$t('dur')"
          ></b-form-input>
        </b-form-group>
        <b-button
          class="button--blue"
          v-if="placeFormMode"
          type="submit"
          variant="primary"
        >
          {{ $t('modifyplace') }}
        </b-button>
        <b-button v-else class="button--blue" type="submit" variant="primary">
          {{ $t('creer') }}
        </b-button>
      </b-form>

      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>

    <b-modal id="place-delete-modal" :title="$t('sup')">
      <b-form @submit="handleplaceFormValuesDelete">
        {{ $t('deleteplace') }}
        <br />
        <br />
        <b-button type="submit" variant="success">Yes</b-button>
        <b-button variant="danger" @click="$bvModal.hide('place-delete-modal')"
          >No</b-button
        >
      </b-form>
      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>
  </div>
</template>

<i18n>
{
  "en": {
    "place":"Your Places",
    "cplace":"Add a new place open to the public",
    "noplace":"You don't have any places for now. Please, create a place to begin.",
    "showqr":"Show QRCode",
    "name":"Name*",
    "duration":"Average duration of the stay in minutes*",
    "nom":"Nom",
    "modif":"Modify",
    "creer":"Create place",
    "delete":"Do you really want to delete the place?",
    "sup":"Delete Place",
    "modifyplace":"Place Modification",
    "deleteplace":"Do you really want to delete this place ?",
    "crea":"Place Creation",
    "pla":"Place Name",
    "dur":"Average Duration",
    "delete":"Delete",
    "action":"Action",
    "subtitle":"Generate a QR Code for this new place"

  },
  "fr": {
    "place":"Vos Adresses",
    "cplace":"Ajoutez un nouveau lieu ouvert au public",
    "noplace":"Vous n'avez pas de lieu pour l'instant. Pour commencer, ajoutez un lieu.",
    "showqr":"Afficher QRCode",
    "name":"Nom*",
    "duration":"Durée moyenne de visite en minutes*",
    "nom":"Nom",
    "modif":"Modifier",
    "creer":"Créer le lieu",
    "delete":"Voulez vous vraiment supprimer le lieu ?",
    "sup":"Supprimer le lieu",
    "modifyplace":"Modification du lieu",
    "deleteplace":"Voulez-vous vraiment supprimer ce lieu ?",
    "crea":"Création du lieu",
    "pla":"Nom du lieu",
    "dur":"Durée estimée",
    "delete":"Supprimer",
    "action":"QR Code",
    "subtitle":"Générez un QR Code pour ce nouveau lieu"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { BootstrapVueIcons } from 'bootstrap-vue'
import { showError } from '../../../helpers/alerts'
import { Place } from '../../../types/Place'
import BigActionButton from '~/components/BigActionButton.vue'

Vue.use(BootstrapVueIcons)
interface PlaceFormValues {
  name: string
  description: string | null
  averageDuration: string
}

@Component({
  components: {
    BigActionButton,
  },
})
export default class ProfessionalPlaces extends Vue {
  fields = [
    { key: 'place_name', label: this.tr('pla') },
    { key: 'average_duration', label: this.tr('dur') },
    { key: 'action', label: this.tr('action') },
    { key: 'modify', label: this.tr('modif') },
    { key: 'delete', label: this.tr('delete') },
  ]

  places: Place[] = []
  place: string = ''
  placeFormMode: Boolean = false
  selectedUser: Place | null = null
  placeFormValues: PlaceFormValues = {
    name: '',
    description: null,
    averageDuration: '',
  }

  mounted() {
    this.loadData()
  }

  async loadData() {
    try {
      this.places = await this.$axios.$get('/places', {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error("Une erreur réseau s'est produite. Veuillez réessayer.")
      )
    }
  }

  async handleplaceFormValuesSubmit(e: Event) {
    e.preventDefault()
    if (this.placeFormMode) {
      try {
        await this.$axios.$put(
          '/place/' + this.place,
          {
            name: this.placeFormValues.name,
            description: this.placeFormValues.description,
            averageDuration: parseInt(this.placeFormValues.averageDuration),
          },
          {
            auth: {
              username: this.$store.getters['session/login'],
              password: this.$store.getters['session/token'],
            },
          }
        )
      } catch (error) {
        showError(
          this.$bvToast,
          'Connexion',
          new Error('A network error has occurred. Please, try again.')
        )
        return
      }
    } else {
      try {
        await this.$axios.$post(
          '/place',
          {
            name: this.placeFormValues.name,
            description: this.placeFormValues.description,
            averageDuration: parseInt(this.placeFormValues.averageDuration),
          },
          {
            auth: {
              username: this.$store.getters['session/login'],
              password: this.$store.getters['session/token'],
            },
          }
        )
      } catch (error) {
        showError(
          this.$bvToast,
          'Connexion',
          new Error('A network error has occurred. Please, try again.')
        )
        return
      }
    }
    this.$bvModal.hide('place-creation-modal')

    this.loadData()
  }

  async handleplaceFormValuesDelete(e: Event) {
    e.preventDefault()
    try {
      await this.$axios.$delete('/place/' + this.place, {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token'],
        },
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error('A network error has occurred. Please, try again.')
      )
      return
    }

    this.$bvModal.hide('place-delete-modal')

    this.loadData()
  }

  PlacetoModify(
    id: string,
    name: string,
    description: string,
    averageDuration: string
  ) {
    this.placeFormMode = true
    this.place = id
    this.placeFormValues.name = name
    this.placeFormValues.description = description
    this.placeFormValues.averageDuration = averageDuration
  }

  tr(ind: string) {
    return this.$i18n.t(ind)
  }

  PlacetoCreate() {
    this.placeFormMode = false
    this.place = ''
    this.placeFormValues.name = ''
    this.placeFormValues.description = ''
    this.placeFormValues.averageDuration = ''
  }

  FormTitle() {
    if (this.placeFormMode) {
      return 'modifyplace'
    } else {
      return 'crea'
    }
  }
}
</script>

<style></style>
