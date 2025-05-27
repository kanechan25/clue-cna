// src/stores/counter-store.ts
import { CounterStore, CounterState } from '@/models/types'
import { createStore } from 'zustand/vanilla'

export const initCounterStore = (): CounterState => {
  return { count: new Date().getFullYear() }
}

export const defaultInitState: CounterState = {
  count: 0,
}

export const createCounterStore = (initState: CounterState = defaultInitState) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }))
}
