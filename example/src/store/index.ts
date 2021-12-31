import { createStore } from "vuex"
import type { TypedStore } from "vuex-typing"
import { counterModuleName, counterModule } from "./modules/counter"
import { textModuleName, textModule } from "./modules/text"

export type RootState = {
  rootVal: string
}
export type ModuleType = {
  [counterModuleName]: typeof counterModule
  [textModuleName]: typeof textModule
}

export type RootStore = TypedStore<RootState, ModuleType>

export const store = createStore<RootState>({
  state: {
    rootVal: "ok",
  },
  modules: {
    [counterModuleName]: counterModule,
    [textModuleName]: textModule,
  },
})
