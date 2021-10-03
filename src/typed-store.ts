import type { BaseGetter, BaseAction, GetterType, DispatchType } from "./core"
import type { IntegrateModuleOptions } from "./utility"
import type { Store } from "vuex"

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
