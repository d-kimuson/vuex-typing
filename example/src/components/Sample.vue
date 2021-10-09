<template>
  <div>cnt: {{cnt}}</div>
  <div>cnt2: {{cnt2}}</div>
  <div>rootVal: {{rootVal}}</div>
  <div>txt: {{txt}}</div>

  <button @click="increment">INCREMENT</button>
  <button @click="PLUS_N(20)">PLUS_N(20)</button>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { useStore, mapState, mapGetters, mapActions } from "../store/util"

const Sample = defineComponent({
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
    ...mapGetters("counter", ["cnt", "cnt2"]),
    ...mapGetters(["counter/cnt", "counter/cnt2"]),
  },
  methods: {
    ...mapActions(["counter/INCREMENT"]),
    ...mapActions("counter", ["PLUS_N"]),
    async mapX() {
      // mapGetters
      this["counter/cnt"] // :number
      this.cnt // :number
      this.cnt2 // : number

      // mapState
      this.rootVal // :string
      this.txt // :string

      // mapActions
      this["counter/INCREMENT"]()
      this.PLUS_N(20)
    },
    async fromStore() {
      this.$store.dispatch("counter/PLUS_N_LOOP", 20)
    },
    increment() {
      this["counter/INCREMENT"]()
    }
  },
})
export default Sample
</script>
