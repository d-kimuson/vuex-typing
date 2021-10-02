import type { IsAny, IsNever } from "./type-utils"

export type BaseState = Record<string, any>
export type BaseGetter<State = BaseState> = (
  state: State,
  ...args: [any?]
) => any
export type BaseMutation<State = BaseState> = (
  state: State,
  ...args: [any?]
) => void
export type BaseAction<
  Context = ContextType<
    BaseState,
    BaseGetter,
    BaseMutation,
    Record<string, (context: any, ...args: [any?]) => void>
  >
> = (context: Context, ...args: [any?]) => void
export type BaseModule = {
  state: () => BaseState
  getters?: Record<string, BaseGetter<any>>
  actions?: Record<string, BaseAction>
}

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

export type GetterType<Mutation extends Record<string, any>> = {
  [K in keyof Mutation as ReturnType<Mutation[K]> extends infer I
    ? IsAny<I> extends true
      ? never
      : K
    : never]: ReturnType<Mutation[K]>
}

export type ExtractPayload<T extends (stateOrContext: any) => void> =
  T extends (stateOrContext: any) => void
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

/**
 * @example ReturnTypeAsPromise<() => Promise<string>) = Promise<string>
 * @example ReturnTypeAsPromise<() => string) = Promise<string>
 */
type ReturnTypeAsPromise<F extends (...args: any[]) => any> = F extends (
  ...args: any[]
) => Promise<infer I>
  ? Promise<I>
  : Promise<ReturnType<F>>

export type LocalDispatch<Actions extends Record<string, BaseAction>> = <
  Key extends keyof Actions
>(
  key: Key,
  ...args: ExtractPayload<Actions[Key]> extends infer I
    ? IsNever<I> extends true
      ? []
      : [I]
    : never
) => ReturnTypeAsPromise<Actions[Key]>

export type DispatchType<Action extends Record<string, any>> = <
  Type extends keyof Action
>(
  key: Type,
  ...args: ExtractPayload<Action[Type]> extends infer I
    ? IsNever<I> extends true
      ? []
      : [I]
    : never
) => ReturnTypeAsPromise<Action[Type]>

export type ActionToMethod<Declare extends BaseAction> = (
  ...args: ExtractPayload<Declare> extends infer I
    ? IsNever<I> extends true
      ? []
      : [I]
    : never
) => ReturnTypeAsPromise<Declare>
