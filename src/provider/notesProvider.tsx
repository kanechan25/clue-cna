import React, { createContext, useContext, useRef, useEffect } from 'react'
import { useStore } from 'zustand'
import { createNotesStore } from '@/stores/notes'
import type { NotesStore } from '@/models/notes'

type NotesStoreApi = ReturnType<typeof createNotesStore>

const NotesStoreContext = createContext<NotesStoreApi | undefined>(undefined)

interface NotesStoreProviderProps {
  children: React.ReactNode
}

export const NotesStoreProvider: React.FC<NotesStoreProviderProps> = ({ children }) => {
  const storeRef = useRef<NotesStoreApi | null>(null)

  if (!storeRef.current) {
    storeRef.current = createNotesStore({})
  }

  // Initialize data from localStorage on mount
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().loadFromLocalStorage()
    }
  }, [])

  return <NotesStoreContext.Provider value={storeRef.current}>{children}</NotesStoreContext.Provider>
}

export const useNotesStore = <T,>(selector: (store: NotesStore) => T): T => {
  const notesStoreContext = useContext(NotesStoreContext)

  if (!notesStoreContext) {
    throw new Error('useNotesStore must be used within NotesStoreProvider')
  }

  return useStore(notesStoreContext, selector)
}
