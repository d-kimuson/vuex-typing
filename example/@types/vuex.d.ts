import type { RootStore } from "../store/index"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: RootStore
  }
}
