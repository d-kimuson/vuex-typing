import type { RootStore } from "../src/store/index"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: RootStore
  }
}
