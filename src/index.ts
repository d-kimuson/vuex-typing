import type { ComputedGetter } from "@vue/reactivity"
import type { Store, Dispatch, Module } from "vuex"
import type { IsAny, IsNever, UnionToIntersection } from "./util"

type BaseState = Record<string, any>
type BaseGetter<State = BaseState> = (state: State, ...args: [any?]) => any
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
    Module<State, {}>,
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

export type TypedStore<
  State,
  Modules extends {
    [moduleName: string]: {
      state: () => Record<string, unknown>
      getters?: Record<string, BaseGetter<any>>
      actions?: Record<string, BaseAction>
    }
  },
  IntegratedState = State & {
    [K in keyof Modules]: ReturnType<Modules[K]["state"]>
  },
  IntegratedGetters = IntegrateModuleOptions<{
    [K in keyof Modules]: NonNullable<Modules[K]["getters"]>
  }>,
  IntegratedActions = IntegrateModuleOptions<{
    [K in keyof Modules]: Modules[K]["actions"]
  }>
> = Omit<Store<IntegratedState>, "dispatch" | "getters"> & {
  getters: GetterType<IntegratedGetters>
  dispatch: DispatchType<IntegratedActions>
}

/**
 * @example IntegratedModuleOptions<{ module1: { increment: T } }> = { 'module1/increment': T }
 */
export type IntegrateModuleOptions<Modules extends Record<string, any>> =
  UnionToIntersection<
    {
      [ModuleName in keyof Modules]: {
        // @ts-expect-error
        [K in keyof Modules[ModuleName] as `${ModuleName}/${K}`]: Modules[ModuleName][K]
      }
    }[keyof Modules]
  >

type BaseModule = {
  state: () => BaseState
  getters?: Record<string, BaseGetter<any>>
  actions?: Record<string, BaseAction>
}

export type ToGetterRef<
  Getter,
  Keys extends keyof Getter,
  Selected = Pick<Getter, Keys>
> = {
  [K in keyof Selected]: () => Selected[K]
}

export type MapGetters<
  ModuleType extends {
    [moduleName: string]: BaseModule
  },
  RootGetters = IntegrateModuleOptions<{
    [K in keyof ModuleType]: NonNullable<ModuleType[K]["getters"]>
  }>
> = <
  ModuleName extends keyof ModuleType,
  Keys extends keyof Getters,
  RootKeys extends keyof RootGetters,
  Getters = NonNullable<ModuleType[ModuleName]["getters"]>
>(
  ...args: [ModuleName, Keys[]] | [RootKeys[]]
) => IsNever<Keys> extends true
  ? ToGetterRef<RootGetters, RootKeys>
  : Pick<Getters, Keys>

export type ToStateRef<Getter extends Record<string, BaseGetter<any>>> = {
  [K in keyof Getter]: ComputedGetter<ReturnType<Getter[K]>>
}

export type MapState<
  RootState,
  ModuleType extends {
    [moduleName: string]: BaseModule
  }
> = <
  ModuleName extends keyof ModuleType,
  RootGetters extends Record<string, (state: RootState) => any>,
  ModuleGetters extends {
    [K: string]: (state: ReturnType<ModuleType[ModuleName]["state"]>) => any
  },
  IS_MODULE = string extends keyof RootGetters ? true : false
>(
  arg0: ModuleName | RootGetters,
  ...args: [ModuleGetters?]
) => IS_MODULE extends true
  ? ToStateRef<ModuleGetters>
  : ToStateRef<RootGetters>

export type ActionToMethod<Declare extends BaseAction, Ret = any> = (
  ...args: ExtractPayload<Declare> extends infer I
    ? IsNever<I> extends true
      ? []
      : [I]
    : never
) => Promise<Ret>

export type MapActions<
  ModuleType extends {
    [moduleName: string]: BaseModule
  },
  RootActions = IntegrateModuleOptions<{
    [K in keyof ModuleType]: ModuleType[K]["actions"]
  }>
> = <
  ModuleName extends keyof ModuleType,
  Keys extends keyof Actions,
  RootKeys extends keyof RootActions,
  Actions = NonNullable<ModuleType[ModuleName]["actions"]>
>(
  ...args: [ModuleName, Keys[]] | [RootKeys[]]
) => IsNever<Keys> extends true
  ? {
      [K in Extract<keyof RootActions, RootKeys>]: ActionToMethod<
        RootActions[K],
        undefined
      >
    }
  : {
      [K in Extract<keyof Actions, Keys>]: ActionToMethod<Actions[K], undefined>
    }
