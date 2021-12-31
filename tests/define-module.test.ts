import { expectType } from "tsd"
import type { LocalDispatch } from "vuex-typing"
import { defineModule } from "vuex-typing"

describe("basic options", () => {
  it("basic options", () => {
    type State = { key: string }
    const module = defineModule(
      {
        state: () => ({ key: "value" }),
        getters: {
          getter1: (state) => {
            expectType<State>(state)
            return state.key
          },
        },
        mutations: {
          commit1: (state, payload: string) => {
            expectType<State>(state)
          },
        },
      },
      {
        action1: ({ getters, commit }) => {
          expectType<string>(getters.getter1)
          commit("commit1", "value")
        },
      }
    )

    expect(true).toBe(true)
  })

  it("local dispatch", () => {
    const localDispatchModule = defineModule(
      {
        state: () => ({}),
      },
      {
        syncAction: (context, payload: string) => payload,
        asyncAction: async (context, payload: string) => payload,
        test: ({ dispatch: _dispatch }) => {
          const dispatch = _dispatch as LocalDispatch<
            LocalDispatchModule["actions"]
          >

          const syncRes = dispatch("syncAction", "string")
          expectType<Promise<string>>(syncRes)

          const asyncRes = dispatch("asyncAction", "string")
          expectType<Promise<string>>(asyncRes)
        },
      }
    )

    type LocalDispatchModule = typeof localDispatchModule
  })
})
