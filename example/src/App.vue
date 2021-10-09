<script lang="ts">
import { defineComponent } from "vue"
import Sample from './components/Sample.vue'

const App = defineComponent({
  components: {
    Sample
  }
})

export default App
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Sample />
</template>
