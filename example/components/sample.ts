import { defineComponent } from "vue"

import { useStore, mapGetters } from "example/store"

const sample = defineComponent({
  setup() {
    const store = useStore()

    return {
      counterInSetup: store.state.counter, // number
      textInSetup: store.state.text, // string | undefined
    }
  },
  computed: {
    ...mapGetters("counter", ["cnt"]),
    ...mapGetters(["counter/cnt"]),
  },
  methods: {
    test() {
      // mapGetters
      this["counter/cnt"] // :number
      this.cnt // :number
    },
  },
})
export default sample
