<template>
  <div class="card card-content text-center">
    <p>{{ emptyText }}</p>

    <div>
      <img
        class="img-fluid"
        src="~/assets/images/places-empty.png"
        srcset="
              ~/assets/images/places-empty.png    1x,
              ~/assets/images/places-empty@2x.png 2x
              ~/assets/images/places-empty@3x.png 3x
            "
      />
    </div>
  </div>
</template>

<i18n>
{
    "en": {
    },
    "fr": {
    }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class EmptyCard extends Vue {
  @Prop({ type: String, required: true }) emptyText!: string
}
</script>

<style lang="scss"></style>
