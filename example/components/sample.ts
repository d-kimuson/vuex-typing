import { defineComponent } from "vue"

import { useStore, mapState, mapGetters, mapActions } from "example/store"

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
    ...mapActions(["counter/INCREMENT"]),
    ...mapActions("counter", ["PLUS_N"]),
    async test() {
      // mapGetters
      this["counter/cnt"] // :number
      this.cnt // :number

      // mapState
      this.rootVal // :string
      this.txt // :string

      // mapActions
      this["counter/INCREMENT"]()
      this.PLUS_N(20)
    },
  },
})
export default sample
