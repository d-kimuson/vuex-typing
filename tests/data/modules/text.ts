import { defineModule } from "vuex-typing"

export const textModuleName = "text"

export const textModule = defineModule(
  {
    state: (): { text: string | undefined } => ({
      text: undefined,
    }),
    getters: {
      txt: (state) => state.text,
    },
    mutations: {
      setText: (state, text: string) => {
        state.text = text
      },
    },
  },
  {
    SET_TEXT: ({ commit }, text: string) => {
      commit("setText", text)
    },
  }
)

type TextModule = typeof textModule
