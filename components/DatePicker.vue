<template>
  <div class="date-picker-container">
    <b-form-input
      class="phone"
      :id="id"
      type="date"
      :value="value ? value.toDateString() : null"
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
}
</script>

<style lang="scss"></style>
