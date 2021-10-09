import { expectType } from "tsd"
import type { RootStore, ModuleType } from "../data/one-module-store"
import { mapState, mapGetters, mapActions } from "../data/one-module-store"

describe("mapState", () => {
  it("direct", () => {
    mapState({
      cnt: (state) => {
        expectType<RootStore["state"]>(state)
        return state.counter.count
      },
    })
  })

  it("module", () => {
    const modName = "counter"
    mapState(modName, {
      cnt: (state) => {
        expectType<ReturnType<ModuleType[typeof modName]["state"]>>(state)
        return state.count
      },
    })
  })
})

describe("mapGetters", () => {
  it("direct", () => {
    const getters = mapGetters(["counter/cnt"])
    expectType<(state: RootStore["state"]["counter"]) => number>(
      getters["counter/cnt"]
    )
  })

  it("module", () => {
    const modName = "counter"
    const getters = mapGetters(modName, ["cnt"])
    expectType<(...args: any[]) => number>(getters.cnt)
  })
})

describe("mapActions", () => {
  it("direct", () => {
    const actions = mapActions(["counter/PLUS_N"])
    expectType<(context: any, payload: number) => Promise<void>>(
      actions["counter/PLUS_N"]
    )
  })

  it("module", () => {
    const modName = "counter"
    const actions = mapActions(modName, ["INCREMENT"])
    expectType<(...args: any[]) => Promise<void>>(actions.INCREMENT)
  })
})
