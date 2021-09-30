import type { StoreOptions, Dispatch, Module } from "vuex"
import type { IsAny, IsNever } from "./util"

type BaseState = Record<string, any>
type BaseGetter<State = BaseState> = (state: State, ...args: [any?]) => void
type BaseMutation<State = BaseState> = (state: State, ...args: [any?]) => void
type BaseAction<
  Context = ContextType<
    BaseState,
    BaseGetter,
    BaseMutation,
    Record<string, (context: any, ...args: [any?]) => void>
  >
> = (context: Context, ...args: [any?]) => void

export type GetterType<Mutation extends Record<string, any>> = {
  [K in keyof Mutation as ReturnType<Mutation[K]> extends infer I
    ? IsAny<I> extends true
      ? never
      : K
    : never]: ReturnType<Mutation[K]>
}

type ExtractPayload<T extends (stateOrContext: any) => void> = T extends (
  stateOrContext: any
) => void
  ? never
  : T extends (stateOrContext: any, payload: infer I) => void
  ? I
  : never

export type CommitType<Mutation extends Record<string, any>> = <
  Type extends keyof Mutation
>(
  key: Type,
  ...args: ExtractPayload<Mutation[Type]> extends infer I
    ? IsNever<I> extends true
      ? []
      : [I]
    : never
) => void

export type DispatchType<Action extends Record<string, any>> = <
  Type extends keyof Action
>(
  key: Type,
  ...args: ExtractPayload<Action[Type]> extends infer I
    ? IsNever<I> extends true
      ? []
      : [I]
    : never
) => ReturnType<Dispatch>

export type ContextType<
  State extends BaseState,
  Getter extends Record<string, any>,
  Mutation extends Record<string, any>,
  Action extends Record<string, any>
> = {
  state: State
  getters: GetterType<Getter>
  commit: CommitType<Mutation>
  dispatch: DispatchType<Action>
}

export function defineModule<
  State extends BaseState,
  Getters = Record<string, BaseGetter<State>>,
  Mutations = Record<string, BaseMutation<State>>,
  Actions = Record<
    string,
    BaseAction<
      Omit<ContextType<State, Getters, Mutations, {}>, "dispatch"> & {
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
    StoreOptions<State>,
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
    ) => void
      ? (context: any, ...args: Args) => void
      : never
  }
} & Omit<Module<State, {}>, "state" | "getters" | "mutations" | "actions"> {
  return {
    ...module,
    namespaced: true,
    // @ts-expect-error
    actions: actions,
  }
}

export type LocalDispatch<Action extends Record<string, BaseAction>> = <
  Key extends keyof Action
>(
  key: Key,
  ...args: ExtractPayload<Action[Key]> extends infer I
    ? IsNever<I> extends true
      ? []
      : [I]
    : never
) => Promise<any>
