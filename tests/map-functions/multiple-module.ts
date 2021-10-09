import { expectType } from "tsd"
import type { RootStore, ModuleType } from "../data/multiple-module-store"
import { mapState, mapGetters, mapActions } from "../data/multiple-module-store"

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

  it("direct(multiple)", () => {
    const getters = mapGetters(["counter/cnt", "counter/cnt3"])
    expectType<(state: RootStore["state"]["counter"]) => number>(
      getters["counter/cnt"]
    )
    // @ts-expect-error not registered getter
    getters["counter/cnt2"]
    expectType<(state: RootStore["state"]["counter"], getters: any) => number>(
      getters["counter/cnt3"]
    )
  })

  it("module", () => {
    const modName = "counter"
    const getters = mapGetters(modName, ["cnt"])
    expectType<(...args: any[]) => number>(getters.cnt)
  })

  it("module(multiple)", () => {
    const modName = "counter"
    const getters = mapGetters(modName, ["cnt", "cnt3"])
    expectType<(...args: any[]) => number>(getters.cnt)
    // @ts-expect-error not registered getter
    getters.cnt2
    expectType<(...args: any[]) => number>(getters.cnt3)
  })
})

describe("mapActions", () => {
  it("direct", () => {
    const actions = mapActions(["counter/PLUS_N"])
    expectType<(context: any, payload: number) => Promise<void>>(
      actions["counter/PLUS_N"]
    )
  })

  it("direct(multiple)", () => {
    const actions = mapActions(["counter/PLUS_N", "counter/INCREMENT"])
    expectType<(context: any, payload: number) => Promise<void>>(
      actions["counter/PLUS_N"]
    )
    expectType<(context: any) => Promise<void>>(actions["counter/INCREMENT"])
    expectType<(context: any, payload: number) => Promise<void>>(
      actions["counter/PLUS_N"]
    )
    // @ts-expect-error not registered action
    actions["counter/PLUS_N_LOOP"]
  })

  it("module", () => {
    const modName = "counter"
    const actions = mapActions(modName, ["INCREMENT", "PLUS_N"])
    expectType<(context: any, payload: number) => Promise<void>>(actions.PLUS_N)
    expectType<(context: any) => Promise<void>>(actions.INCREMENT)
    // @ts-expect-error not registered action
    actions.PLUS_N_LOOP
  })
})
