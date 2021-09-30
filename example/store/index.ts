import { InjectionKey } from "vue"
import {
  createStore,
  useStore as baseUseStore,
  mapGetters as baseMapGetters,
  mapState as baseMapState,
  mapActions as baseMapActions,
} from "vuex"
import { TypedStore, MapState, MapGetters, MapActions } from "vuex-typing"

import { counterModuleName, counterModule } from "./counter"
import { textModuleName, textModule } from "./text"

export type RootState = {
  rootVal: string
}
type ModuleType = {
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

export const key: InjectionKey<RootStore> = Symbol()
export function useStore(): RootStore {
  return baseUseStore(key)
}

export const mapGetters = baseMapGetters as unknown as MapGetters<ModuleType>

export const mapState = baseMapState as unknown as MapState<
  RootStore["state"],
  ModuleType
>

export const mapActions = baseMapActions as unknown as MapActions<ModuleType>
