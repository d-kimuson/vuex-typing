import { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore } from "vuex"
import { TypedStore } from "vuex-typing"

import { counterModuleName, counterModule } from "./counter"

export type RootState = {}
type ModuleType = {
  [counterModuleName]: typeof counterModule
}

export type RootStore = TypedStore<RootState, ModuleType>

export const store = createStore<RootState>({
  modules: {
    [counterModuleName]: counterModule,
  },
})

export const key: InjectionKey<RootStore> = Symbol()
export function useStore(): RootStore {
  return baseUseStore(key)
}
