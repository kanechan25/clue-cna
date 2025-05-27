import { useState } from 'react'

interface CounterProps {
  initialValue?: number
  label?: string
}

export const Counter = ({ initialValue = 0, label = 'Count' }: CounterProps) => {
  const [count, setCount] = useState(initialValue)

  const handleIncrement = () => setCount((prev) => prev + 1)
  const handleDecrement = () => setCount((prev) => prev - 1)
  const handleReset = () => setCount(initialValue)

  return (
    <div className='flex flex-col items-center gap-4 p-4 rounded-lg border border-gray-200'>
      <h2 className='text-xl font-semibold'>{label}</h2>
      <p className='text-2xl font-bold' data-testid='count-value'>
        {count}
      </p>
      <div className='flex gap-2'>
        <button
          onClick={handleDecrement}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
          aria-label='Decrease count'
        >
          -
        </button>
        <button
          onClick={handleReset}
          className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
          aria-label='Reset count'
        >
          Reset
        </button>
        <button
          onClick={handleIncrement}
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
          aria-label='Increase count'
        >
          +
        </button>
      </div>
    </div>
  )
}
