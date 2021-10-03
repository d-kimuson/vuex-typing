import { expectType } from "tsd"
import { createStore } from "vuex"
import type { TypedStore } from "vuex-typing"
import { counterModuleName, counterModule } from "./data/counter-module"

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

describe("typed store", () => {
  it("types for state, getters", () => {
    expectType<RootStore["state"]>({
      rootVal: "string",
      counter: {
        count: 0, // number
      },
    })

    expectType<RootStore["getters"]["counter/cnt"]>(0) // number
  })

  it("store", () => {
    const _store = store as RootStore
    expectType<string>(_store.state.rootVal)
    expectType<number>(_store.state.counter.count)
    expectType<number>(_store.getters["counter/cnt"])
    expectType<Promise<void>>(_store.dispatch("counter/INCREMENT"))
    expectType<Promise<void>>(_store.dispatch("counter/PLUS_N", 20))
  })
})
