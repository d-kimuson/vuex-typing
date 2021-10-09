import type { LocalGetters, LocalDispatch } from "./core"
import type { TypedStore } from "./typed-store"
import type { MapState, MapGetters, MapActions } from "./utility"
import { defineModule } from "./define-module"

export { defineModule }
export type {
  TypedStore,
  LocalGetters,
  LocalDispatch,
  MapState,
  MapGetters,
  MapActions,
}
