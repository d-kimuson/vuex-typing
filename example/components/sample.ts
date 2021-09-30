import { defineComponent } from "vue"

import { useStore } from "example/store"

const sample = defineComponent({
  setup() {
    const store = useStore()

    return {
      counterInSetup: store.state.counter, // number
      textInSetup: store.state.text, // string | undefined
    }
  },
})
export default sample
