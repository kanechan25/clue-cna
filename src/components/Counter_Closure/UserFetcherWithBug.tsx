import { useState, useCallback, JSX, memo } from 'react'

type User = { name: string; age: number }

export default function UserFetcherWithBug(): JSX.Element {
  const [userId, setUserId] = useState<number>(1)
  const fetchUser = useCallback(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`) // userId bị stale
      .then((res) => res.json())
      .then((data) => console.log('Fetched:', data.name))
  }, [userId]) // ✅ phải add correct deps to avoid stale id

  const Profile = memo(({ user }: { user: User }) => {
    console.log('🔁 Profile re-render')
    return (
      <div className='p-2 border'>
        <p>{user.name}</p>
        <p>{user.age} years old</p>
      </div>
    )
  })
  const user = { name: 'Alice', age: 30 } // ❌ sai vì object mới mỗi render => phải useMemo nó lại

  return (
    <div className='p-4'>
      <h3 className='text-xl font-bold'>User ID: {userId}</h3>
      <div className='space-x-2 mt-2'>
        <button onClick={() => setUserId((id) => id + 1)} className='px-4 py-2 bg-green-500 text-white rounded'>
          Next User
        </button>
        <button onClick={fetchUser} className='px-4 py-2 bg-gray-600 text-white rounded'>
          Fetch Current User
        </button>
      </div>
      <Profile user={user} />
    </div>
  )
}
