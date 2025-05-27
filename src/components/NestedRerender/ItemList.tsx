import { JSX, memo, useCallback, useMemo, useState } from 'react'

type Item = { id: number; name: string; meta?: { city: string; followers: number[] } }

const ListItem = memo(({ item, onSelect }: { item: Item; onSelect: (id: number) => void }) => {
  console.log(`🔁 Render item ${item.id}`)
  return (
    <div onClick={() => onSelect(item.id)} className='p-2 border hover:bg-gray-600 cursor-pointer'>
      {item.name}
    </div>
  )
})

export default function ItemList(): JSX.Element {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const serverItems = useMemo(
    () => [
      { id: 1, name: 'Alice', meta: { city: 'Hanoi', followers: [1, 2, 3] } },
      { id: 2, name: 'Bob', meta: { city: 'Danang', followers: [4, 5, 6] } },
      { id: 3, name: 'Charlie', meta: { city: 'TPHCM', followers: [7, 8, 9] } },
    ],
    [],
  )

  const items = useMemo(
    () => [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bobc' },
      { id: 3, name: 'Charlie' },
    ],
    [],
  ) // ❌ không memo thì lần nào items cũng thay đổi => re-render mỗi lần

  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  ) // ❌ không memo thì lần nào items cũng thay đổi => re-render mỗi lần
  // Nhưng như thế này thì không đủ, khi items là nested-nested-object => vẫn render vì React.memo chỉ shallow compare
  const itemMap = useMemo(() => {
    const map = new Map<number, Item>()
    serverItems.forEach((item) => map.set(item.id, item))
    return map
  }, [serverItems]) // nhưng cần kiểm soát reference của serverItems

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id)
  }, [])

  return (
    <div className='p-4'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='mb-4 border p-2'
        placeholder='Search'
      />
      <div className='space-y-2'>
        {filteredItems.map((item) => {
          const mappedItem = itemMap.get(item.id)
          return mappedItem ? <ListItem key={item.id} item={mappedItem} onSelect={handleSelect} /> : null
        })}
      </div>
      <p className='mt-4'>
        Selected ID: {selectedId} {selectedId ? itemMap.get(selectedId)?.meta?.city : ''}
      </p>
    </div>
  )
}
