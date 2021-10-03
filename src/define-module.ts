import type {
  BaseState,
  BaseGetter,
  BaseMutation,
  BaseAction,
  ContextType,
} from "./core"
import type { Module } from "vuex"

export function defineModule<
  State extends BaseState,
  Getters = Record<string, BaseGetter<State>>,
  Mutations = Record<string, BaseMutation<State>>,
  Actions = Record<
    string,
    BaseAction<
      Omit<
        ContextType<State, Getters, Mutations, Record<string, unknown>>,
        "dispatch"
      > & {
        dispatch: (key: string, ...args: [any?]) => Promise<any>
      }
    >
  >
>(
  module: {
    state: () => State
    getters?: Getters
    mutations?: Mutations
  } & Omit<
    Module<State, Record<string, unknown>>,
    "state" | "getters" | "mutations" | "namespaced" | "actions" | "modules"
  >,
  actions?: Actions
): {
  state: () => State
  getters?: Getters
  mutations?: Mutations
  actions: {
    [K in keyof Actions]: Actions[K] extends (
      context: any,
      ...args: infer Args
    ) => infer Ret
      ? (context: any, ...args: Args) => Ret
      : never
  }
} & Omit<
  Module<State, Record<string, unknown>>,
  "state" | "getters" | "mutations" | "actions"
> {
  return {
    ...module,
    namespaced: true,
    // @ts-expect-error
    actions: actions,
  }
}
