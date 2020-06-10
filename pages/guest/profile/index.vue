<template>
  <div>
    <b-card tag="article" style="max-width: 40rem;" class="mb-2">
      <b-form>
        <b-form-group
          id="form-email"
          label="Email address:"
          label-for="form-email"
        >
          <b-form-input
            id="form-email"
            type="email"
            required
            placeholder="Your email:"
          ></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox-group id="form-save-email">
            <b-form-checkbox value="save-email"
              >Store my email address to be warned whenever a contact was
              infected by the Covid-19.</b-form-checkbox
            >
          </b-form-checkbox-group>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class GuestProfile extends Vue {}
</script>

<style></style>
