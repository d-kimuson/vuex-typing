import { InjectionKey } from "vue"
import {
  useStore as baseUseStore,
  mapGetters as baseMapGetters,
  mapState as baseMapState,
  mapActions as baseMapActions,
} from "vuex"
import { MapState, MapGetters, MapActions } from "vuex-typing"
import type { RootStore, ModuleType } from "./"

export const key: InjectionKey<RootStore> = Symbol()

export function useStore(): RootStore {
  return baseUseStore(key)
}

export const mapState = baseMapState as unknown as MapState<
  RootStore["state"],
  ModuleType
>

export const mapGetters = baseMapGetters as unknown as MapGetters<ModuleType>
export const mapActions = baseMapActions as unknown as MapActions<ModuleType>
