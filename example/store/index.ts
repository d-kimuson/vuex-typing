import { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore } from "vuex"
import { counterModuleName, counterModule } from "./counter"

export type RootState = {}

export const store = createStore<RootState>({
  modules: {
    [counterModuleName]: counterModule,
  },
})

export const key: InjectionKey<RootState> = Symbol()
export function useStore(): RootState {
  return baseUseStore(key)
}
