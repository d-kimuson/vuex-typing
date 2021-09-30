import { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore } from "vuex"

export type GlobalState = {}

export const store = createStore<GlobalState>({})

export const key: InjectionKey<GlobalState> = Symbol()
export function useStore(): GlobalState {
  return baseUseStore(key)
}
