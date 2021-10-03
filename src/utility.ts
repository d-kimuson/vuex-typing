import type { BaseGetter, BaseModule, ActionToMethod } from "./core"
import type { IsNever, UnionToIntersection } from "./type-utils"
import type { ComputedGetter } from "@vue/reactivity"

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
        RootActions[K]
      >
    }
  : {
      [K in Extract<keyof Actions, Keys>]: ActionToMethod<Actions[K]>
    }
