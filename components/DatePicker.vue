<template>
  <div class="date-picker-container">
    <b-form-input
      class="phone"
      :id="id"
      type="date"
      :value="value ? getFormattedDate(value) : null"
      @input="updateValueString"
      placeholder="MM/DD/YYYY"
    ></b-form-input>
    <client-only>
      <vc-date-picker
        mode="single"
        class="computer"
        :max-date="new Date()"
        :id="id"
        :value="value"
        @input="updateValueDate"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Model, Emit } from 'vue-property-decorator'

@Component
export default class DatePicker extends Vue {
  @Prop({ type: String, required: true }) readonly id!: string
  @Model('input', { type: Date, required: false }) readonly value?: Date | null

  @Emit('input')
  updateValueDate(value: Date) {
    return value
  }

  @Emit('input')
  updateValueString(value: string) {
    return new Date(value)
  }

  // format to YYYY-MM-DD
  getFormattedDate(date: Date) {
    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : '0' + month

    let day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day

    return date.getFullYear() + '-' + month + '-' + day
  }
}
</script>

<style lang="scss"></style>
