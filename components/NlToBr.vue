<script lang="ts">
import { VNode } from 'vue'
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class NlToBr extends Vue {
  @Prop({ type: String, required: false, default: 'p' }) tag!: string
  @Prop({ type: String, required: false, default: '' }) className!: string
  @Prop({ type: String, required: false, default: null }) text!: string | null

  render(
    createElement: (
      tag: string,
      attrs?: any,
      content?: (VNode | string)[]
    ) => VNode
  ): VNode | null {
    if (this.text == null) {
      return null
    }

    const nodes: (string | VNode)[] = this.text
      .split('\n')
      .flatMap((line) => [line, createElement('br')])

    // Remove the last <br>
    nodes.pop()

    return createElement(this.tag, { class: this.className }, nodes)
  }
}
</script>
