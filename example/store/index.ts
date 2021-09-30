import { InjectionKey } from "vue"
import {
  createStore,
  useStore as baseUseStore,
  mapGetters as baseMapGetters,
} from "vuex"
import { TypedStore, MapGetters } from "vuex-typing"

import { counterModuleName, counterModule } from "./counter"
import { textModuleName, textModule } from "./text"

export type RootState = {}
type ModuleType = {
  [counterModuleName]: typeof counterModule
  [textModuleName]: typeof textModule
}

export type RootStore = TypedStore<RootState, ModuleType>

export const store = createStore<RootState>({
  modules: {
    [counterModuleName]: counterModule,
    [textModuleName]: textModule,
  },
})

export const key: InjectionKey<RootStore> = Symbol()
export function useStore(): RootStore {
  return baseUseStore(key)
}

export const mapGetters = baseMapGetters as unknown as MapGetters<
  RootStore["getters"],
  ModuleType
>
