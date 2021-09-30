import { defineComponent } from "vue"

import { useStore, mapState, mapGetters } from "example/store"

const sample = defineComponent({
  setup() {
    const store = useStore()

    return {
      counterInSetup: store.state.counter, // number
      textInSetup: store.state.text, // string | undefined
    }
  },
  computed: {
    ...mapState({
      rootVal: (state) => state.rootVal,
    }),
    ...mapState("text", {
      txt: (state) => state.text,
    }),
    ...mapGetters("counter", ["cnt"]),
    ...mapGetters(["counter/cnt"]),
  },
  methods: {
    test() {
      // mapGetters
      this["counter/cnt"] // :number
      this.cnt // :number

      // mapState
      this.rootVal // :string
      this.txt // :string
    },
  },
})
export default sample
