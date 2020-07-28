<template>
  <div>
    <b-form-input
      class="phone"
      :id="id"
      type="time"
      placeholder="12:00"
      :value="value"
      @input="updateValue"
    ></b-form-input>
    <vue-timepicker
      class="computer"
      :id="id"
      :value="value"
      @input="updateValue"
    ></vue-timepicker>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Model, Emit } from 'vue-property-decorator'

@Component
export default class DatePicker extends Vue {
  @Prop({ type: String, required: true }) readonly id!: string
  @Model('input', { type: String, required: true }) readonly value!: string

  @Emit('input')
  updateValue(value: string) {
    return value
  }
}
</script>

<style lang="scss"></style>
