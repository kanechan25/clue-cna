import { JSX, useCallback, useState } from 'react'

export default function CounterWithBug(): JSX.Element {
  const [count, setCount] = useState<number>(0)

  const handleClick = useCallback(() => {
    setTimeout(() => {
      console.log('Clicked! Current count:', count) // ❌ stale count khi user click sau nhiều lần render
    }, 1000)
  }, [count]) // nên là phải có `count` trong deps

  return (
    <div className='p-4'>
      <h3 className='text-xl font-bold'>Count: {count}</h3>
      <div className='space-x-2 mt-2'>
        <button onClick={() => setCount((c) => c + 1)} className='px-4 py-2 bg-blue-500 text-white rounded'>
          Click to +1
        </button>
        <button onClick={handleClick} className='px-4 py-2 bg-gray-600 text-white rounded'>
          Log Count in 1s
        </button>
      </div>
    </div>
  )
}
