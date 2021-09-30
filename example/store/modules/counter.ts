import { defineModule, LocalDispatch } from "vuex-typing"

export const counterModuleName = "counter"

export const counterModule = defineModule(
  {
    state: (): { count: number } => ({
      count: 0,
    }),
    getters: {
      cnt: (state) => state.count,
    },
    mutations: {
      increment: (state) => {
        state.count++
      },
      plusN: (state, n: number) => {
        state.count = state.count + n
      },
    },
  },
  {
    INCREMENT: ({ commit }) => {
      commit("increment")
    },
    PLUS_N: ({ commit }, n: number) => {
      commit("plusN", n)
    },
    PLUS_N_LOOP: ({ dispatch: _dispatch }, n: number) => {
      const dispatch: LocalDispatch<CounterModule["actions"]> = _dispatch

      for (const _i of new Array(n)) {
        dispatch("INCREMENT")
      }
    },
  }
)

type CounterModule = typeof counterModule