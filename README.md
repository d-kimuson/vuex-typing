# vuex-typing

vuex-typing is a small helper library for typing in vuex.
vuex does not provide typing such as dispatch or getter by default. vuex-typing allows you to type in vuex with minimal additional code.

## Installation

vuex-typing supports vue@3 and vue@4.

```bash
$ yarn add vue@next vuex@next vuex-typing
```

## How to type in vuex ?

Typing is done by passing the vuex module definition to `defineModule` provided by vuex-typing. By passing the module definition through the defineModule function, we can pick up the types from the implementation and avoid duplicating the type declaration and implementation. This is the same approach used in vue3's `defineComponent`.

```ts
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
```

The first argument is the standard options of the vuex module, and only the actions are passed as the second argument to ensure that the context is properly typed.

The return value is a configuration object that merges the two options passed to the function with `namespaced: true`, so you can register it as a module in the store.

```ts
// store/index.ts
import { createStore } from "vuex"
import { TypedStore } from "vuex-typing"

import { textModuleName, textModule } from "./modules/text"

export type RootState = {}
export type ModuleType = {
  [textModuleName]: typeof textModule
}

export type RootStore = TypedStore<RootState, ModuleType>

export const store = createStore<RootState>({
  modules: {
    [textModuleName]: textModule,
  },
})
```

Now that `RootStore` is typed for the module, we can type `this.$store` and `useStore` as recommended by the vuex formula.

```ts
// store/util.ts
import { InjectionKey } from "vue"
import { useStore as baseUseStore } from "vuex"
import type { RootStore } from "./index"

export const key: InjectionKey<RootStore> = Symbol()

export function useStore(): RootStore {
  return baseUseStore(key)
}
```

```ts
// @types/vuex.d.ts
import type { RootStore } from "../src/store/index"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: RootStore
  }
}
```

The configuration is now complete.
Typing will be provided when using useStore or this.$store as usual. The whole example can be found under the example directory

### Using other actions in the module

When using defineModule, the context will be typed, but only the dispatch will need to inject a type definition by using `LocalDispatch`.

```ts
import { defineModule, LocalDispatch } from "vuex-typing"

export const counterModuleName = "counter"

export const counterModule = defineModule(
  // ...
  {
    INCREMENT: ({ commit }): void => {
      commit("increment")
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
```

### typing with mapX helper function

vuex-typing provides types that override the typedefs of helper functions such as mapGetters.


```ts
// store/util.ts
import { InjectionKey } from "vue"
import {
  useStore as baseUseStore,
  mapGetters as baseMapGetters,
  mapState as baseMapState,
  mapActions as baseMapActions,
} from "vuex"
import { MapState, MapGetters, MapActions } from "vuex-typing"
import type { RootStore, ModuleType } from "."

export const key: InjectionKey<RootStore> = Symbol()

export function useStore(): RootStore {
  return baseUseStore(key)
}

export const mapState = baseMapState as unknown as MapState<
  RootStore["state"],
  ModuleType
>

export const mapGetters = baseMapGetters as unknown as MapGetters<ModuleType>
export const mapActions = baseMapActions as unknown as MapActions<ModuleType>
```

Use helper functions with overriding type definitions instead of the built-in helper functions

```diff
- import { mapGetters } from 'vuex'           // untyped
+ import { mapGetters } from '../store/util'  // typed

export default defineComponent({
  computed: {
    ...mapGetters({ /* options */ })
  }
})
```

## Not supported

Non-module typing is minimal. The root store supports typing only for state.

Modules are only supported with `namespaced: true`, and defineModules will automatically register this option.
Nested modules are also not supported.
