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
  [K in keyof Selected]: Selected[K]
}

export type MapGetters<
  ModuleType extends {
    [moduleName: string]: BaseModule
  },
  RootGetters = IntegrateModuleOptions<{
    [K in keyof ModuleType]: NonNullable<ModuleType[K]["getters"]>
  }>
> = <
  Arg1 extends keyof ModuleType | (keyof RootGetters)[],
  Arg2 extends IsNever<ModuleName> extends true ? never : (keyof Getters)[],
  ModuleName = Arg1 extends keyof ModuleType ? Arg1 : never,
  Getters = ModuleName extends keyof ModuleType
    ? NonNullable<ModuleType[ModuleName]["getters"]>
    : never
>(
  ...args: [Arg1, Arg2?]
) => IsNever<ModuleName> extends true
  ? Arg1 extends Array<infer RootKeys>
    ? RootKeys extends keyof RootGetters
      ? ToGetterRef<RootGetters, RootKeys>
      : never
    : never
  : Arg2 extends Array<infer Keys>
  ? Keys extends keyof Getters
    ? Pick<Getters, Keys>
    : never
  : never

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
  Arg1 extends keyof ModuleType | (keyof RootActions)[],
  Arg2 extends IsNever<ModuleName> extends true ? never : (keyof Actions)[],
  ModuleName = Arg1 extends keyof ModuleType ? Arg1 : never,
  Actions = ModuleName extends keyof ModuleType
    ? NonNullable<ModuleType[ModuleName]["actions"]>
    : never
>(
  ...args: [Arg1, Arg2?]
) => IsNever<ModuleName> extends true
  ? {
      [K in Extract<
        keyof RootActions,
        Arg1 extends Array<infer I> ? I : never
      >]: ActionToMethod<RootActions[K]>
    }
  : {
      [K in Extract<
        keyof Actions,
        Arg2 extends Array<infer I> ? I : never
      >]: ActionToMethod<Actions[K]>
    }
