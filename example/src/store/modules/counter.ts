import { defineModule } from "vuex-typing"
import type { LocalGetters, LocalDispatch } from "vuex-typing"

export const counterModuleName = "counter"

export const counterModule = defineModule(
  {
    state: (): { count: number } => ({
      count: 0,
    }),
    getters: {
      cnt: (state) => state.count,
      cnt2: (state) => state.count,
      cnt3: (_state, _getters): number => {
        const getters = _getters as LocalGetters<CounterModule["getters"]>
        return getters.cnt
      },
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
    INCREMENT: ({ commit }): void => {
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
