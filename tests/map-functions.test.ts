import { expectType } from "tsd"
import type { RootStore, ModuleType } from "./data/store"
import { mapState, mapGetters, mapActions } from "./data/map-functions"

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
    // FIX: When the number of modules is one, the type is wrong.
  })

  it("module", () => {
    const modName = "counter"
    const getters = mapGetters(modName, ["cnt"])
    expectType<(...args: any[]) => number>(getters.cnt)
  })
})

describe("mapActions", () => {
  it("direct", () => {
    // FIX: When the number of modules is one, the type is wrong.
    const actions = mapActions(["counter/INCREMENT"])
  })

  it("module", () => {
    const modName = "counter"
    const actions = mapActions(modName, ["INCREMENT"])
    expectType<(...args: any[]) => Promise<void>>(actions.INCREMENT)
  })
})
