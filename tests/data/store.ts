import { createStore } from "vuex"
import type { TypedStore } from "vuex-typing"
import { counterModuleName, counterModule } from "./counter-module"

export type RootState = {
  rootVal: string
}
export type ModuleType = {
  [counterModuleName]: typeof counterModule
}

export type RootStore = TypedStore<RootState, ModuleType>

export const store = createStore<RootState>({
  state: {
    rootVal: "ok",
  },
  modules: {
    [counterModuleName]: counterModule,
  },
})
