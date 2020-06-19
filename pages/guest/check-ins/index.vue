<template>
  <div v-if="checkins.length > 0">
    <h1 class="sr-only">All Check-ins</h1>


    <div v-if="infectedcheckins.length > 0">
    <h2>Infected Check-ins</h2>
    <b-table striped hover :fields="fields" :items="infectedcheckins">
      <template v-slot:cell(organization)="data">
        <p style="color:#FF0000";> {{ data.item.place.organization.name }} </p>
      </template>

      <template v-slot:cell(place_name)="data">
        <p style="color:#FF0000";> {{ data.item.place.name }} </p>
      </template>

      <template v-slot:cell(time)="data">
        <p style="color:#FF0000";> {{ data.item.timestamp | formatDateTime }} </p>
      </template>

      <template v-slot:cell(duration)="data">
        <p style="color:#FF0000";> {{ data.item.duration }}m </p>
      </template>
    </b-table>
    </br>
    </div>

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
  
  <div v-else>
    <h1 class="sr-only">All Check-ins</h1>
    <h2>My Check-ins</h2>
    <p>
      You don't have any check-in for now. Scan a QR code in a public location
      to start.
    </p>
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
  infectedcheckins: Checkin[] = []

  async mounted() {
    // Load checkins
    try {
      this.checkins = await this.$axios.$get('/checkins', {
        auth: {
          username: this.$store.getters['session/login'],
          password: this.$store.getters['session/token']
        }
      })
    } catch (error) {
      showError(
        this.$bvToast,
        'Connexion',
        new Error('A network error has occurred. Please, try again.')
      )
    }
    
    this.checkins.forEach((checkin) => { 
      if (checkin.potential_infection) {this.infectedcheckins.push(checkin)}
      })
  }
}
</script>

<style></style>
