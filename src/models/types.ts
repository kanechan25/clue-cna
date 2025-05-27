export type CounterState = {
  count: number
}

export type CounterActions = {
  decrementCount: () => void
  incrementCount: () => void
}

export type CounterStore = CounterState & CounterActions

export type Routes = {
  href: string
  id: string
  name: string
  element: React.ReactNode
}
