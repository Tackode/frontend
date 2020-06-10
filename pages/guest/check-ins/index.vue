<template>
  <div>
    <h1 class="sr-only">All Check-ins</h1>

    <h2>My Check-ins</h2>
    <b-table striped hover :fields="fields" :items="checkins">
      <template v-slot:cell(organization)="data">
        {{ data.item.place.organization.name }}
      </template>

      <template v-slot:cell(place_name)="data">
        {{ data.item.place.name }}
      </template>

      <template v-slot:cell(time)="data">
        {{ data.item.timestamp | formatDateTime }}
      </template>

      <template v-slot:cell(duration)="data">
        {{ data.item.duration }}m
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { showError } from '../../../helpers/alerts'
import { Checkin } from '../../../types/Checkin'

@Component({})
export default class GuestCheckIns extends Vue {
  fields = ['organization', 'place_name', 'time', 'duration']
  checkins: Checkin[] = []

  async mounted() {
    // Load checkins
    try {
      this.checkins = await this.$axios.$get('/checkins', {
        auth: {
          username: 'foo',
          password: 'bar'
        }
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error(
          "Une erreur réseau s'est produite pendant la connexion. Veuillez réessayer."
        )
      )
    }
  }
}
</script>

<style></style>
