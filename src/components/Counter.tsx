import { useCounterStore } from '@/provider/counterProvider'
import Button from './Button'

export const Counter = () => {
  const { count, incrementCount, decrementCount } = useCounterStore((state) => state)

  return (
    <div>
      <h2 className='text-xl font-semibold text-center'>Count: {count}</h2>
      <hr />
      <div className='flex gap-4'>
        <Button onClick={incrementCount}>Increment Count</Button>
        <Button onClick={decrementCount}>Decrement Count</Button>
      </div>
    </div>
  )
}
