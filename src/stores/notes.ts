import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { NotesStore, Note, User, EditOperation, Conflict } from '@/models/notes'
import { createMockNotes, MOCK_USERS } from '@/models/mockData'

const STORAGE_KEY = 'collaborative-notes-app'
const CLEANUP_INTERVAL = 60 * 1000 * 2
const MAX_HISTORY = 100

export const defaultInitState: NotesStore = {
  notes: [],
  currentNote: null,
  users: MOCK_USERS,
  currentUser: MOCK_USERS[0],
  editOperations: [],
  conflicts: [],
  isLoading: false,
  searchQuery: '',
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  setCurrentNote: () => {},
  duplicateNote: () => {},
  addEditOperation: () => {},
  checkForConflicts: () => {},
  resolveConflict: () => {},
  simulateCollaboratorEdit: () => {},
  setCurrentUser: () => {},
  addCollaborator: () => {},
  removeCollaborator: () => {},
  setSearchQuery: () => {},
  getFilteredNotes: () => [],
  saveToLocalStorage: () => {},
  loadFromLocalStorage: () => {},
  clearOldOperations: () => {},
}

export const createNotesStore = (initState: Partial<NotesStore> = {}) => {
  return createStore<NotesStore>()(
    subscribeWithSelector((set, get) => ({
      ...defaultInitState,
      ...initState,

      createNote: (title: string, content: string = '') => {
        const newNote: Note = {
          id: `note-${Date.now()}`,
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedBy: get().currentUser?.id || 'anonymous',
          collaborators: [get().currentUser?.id || 'anonymous'],
          isDeleted: false,
          version: 1,
        }

        set((state) => ({
          notes: [newNote, ...state.notes],
          currentNote: newNote,
        }))

        get().saveToLocalStorage()
        toast.success(`Note "${title}" created successfully!`)
      },

      updateNote: (id: string, updates: Partial<Note>) => {
        set((state) => {
          const noteIndex = state.notes.findIndex((note) => note.id === id)
          if (noteIndex === -1) return state

          const updatedNote = {
            ...state.notes[noteIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
            lastEditedBy: state.currentUser?.id || 'anonymous',
            version: state.notes[noteIndex].version + 1,
          }

          const newNotes = [...state.notes]
          newNotes[noteIndex] = updatedNote

          return {
            notes: newNotes,
            currentNote: state.currentNote?.id === id ? updatedNote : state.currentNote,
          }
        })

        get().saveToLocalStorage()
      },

      deleteNote: (id: string) => {
        const note = get().notes.find((n) => n.id === id)
        if (!note) return

        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote,
        }))

        get().saveToLocalStorage()
        toast.success(`Note "${note.title}" deleted successfully!`)
      },

      setCurrentNote: (note: Note | null) => {
        set(() => ({ currentNote: note }))
      },

      duplicateNote: (id: string) => {
        const originalNote = get().notes.find((note) => note.id === id)
        if (!originalNote) return

        const duplicatedNote: Note = {
          ...originalNote,
          id: `note-${Date.now()}`,
          title: `${originalNote.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedBy: get().currentUser?.id || 'anonymous',
          collaborators: [get().currentUser?.id || 'anonymous'],
          version: 1,
        }

        set((state) => ({
          notes: [duplicatedNote, ...state.notes],
        }))

        get().saveToLocalStorage()
        toast.success(`Note duplicated successfully!`)
      },

      // Real-time collaboration
      addEditOperation: (operation: Omit<EditOperation, 'id' | 'timestamp'>) => {
        const newOperation: EditOperation = {
          ...operation,
          id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          editOperations: [newOperation, ...state.editOperations.slice(0, MAX_HISTORY - 1)],
        }))

        // Check for conflicts
        setTimeout(() => get().checkForConflicts(newOperation), 0)
      },

      checkForConflicts: (newOperation: EditOperation) => {
        const recentOperations = get().editOperations.filter(
          (op) =>
            op.noteId === newOperation.noteId &&
            op.userId !== newOperation.userId &&
            dayjs(op.timestamp).isAfter(dayjs().subtract(5, 'seconds')),
        )

        if (recentOperations.length > 0) {
          const conflict: Conflict = {
            id: `conflict-${Date.now()}`,
            noteId: newOperation.noteId,
            operations: [newOperation, ...recentOperations],
          }

          set((state) => ({
            conflicts: [conflict, ...state.conflicts],
          }))

          toast.warn('Editing conflict detected! Auto-resolving...', {
            position: 'top-right',
          })

          // Auto-resolve conflict after 2 seconds (latest wins strategy)
          setTimeout(() => get().resolveConflict(conflict.id, 'latest-wins'), 2000)
        }
      },

      resolveConflict: (conflictId: string, resolution: Conflict['resolution']) => {
        set((state) => {
          const conflict = state.conflicts.find((c) => c.id === conflictId)
          if (!conflict) return state

          const resolvedConflict = {
            ...conflict,
            resolvedAt: new Date().toISOString(),
            resolution,
          }

          return {
            conflicts: state.conflicts.map((c) => (c.id === conflictId ? resolvedConflict : c)),
          }
        })

        toast.success(`Conflict resolved using ${resolution} strategy`)
      },

      simulateCollaboratorEdit: (noteId: string, content: string) => {
        const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]
        const currentUser = get().currentUser

        if (randomUser.id === currentUser?.id) return

        get().updateNote(noteId, { content })

        get().addEditOperation({
          noteId,
          userId: randomUser.id,
          operation: 'insert',
          position: content.length,
          content: content.slice(-10),
          version: get().notes.find((n) => n.id === noteId)?.version || 1,
        })

        toast.info(`${randomUser.name} made changes to the note`, {
          position: 'bottom-left',
          autoClose: 3000,
        })
      },

      // User management
      setCurrentUser: (user: User) => {
        set(() => ({ currentUser: user }))
      },

      addCollaborator: (noteId: string, userId: string) => {
        const note = get().notes.find((n) => n.id === noteId)
        if (!note || note.collaborators.includes(userId)) return

        get().updateNote(noteId, {
          collaborators: [...note.collaborators, userId],
        })

        const user = get().users.find((u) => u.id === userId)
        toast.success(`${user?.name} added as collaborator`)
      },

      removeCollaborator: (noteId: string, userId: string) => {
        const note = get().notes.find((n) => n.id === noteId)
        if (!note) return

        get().updateNote(noteId, {
          collaborators: note.collaborators.filter((id) => id !== userId),
        })

        const user = get().users.find((u) => u.id === userId)
        toast.info(`${user?.name} removed from collaborators`)
      },

      // Search and filters
      setSearchQuery: (query: string) => {
        set(() => ({ searchQuery: query }))
      },

      getFilteredNotes: () => {
        const { notes, searchQuery } = get()
        if (!searchQuery.trim()) return notes

        const query = searchQuery.toLowerCase()
        return notes.filter(
          (note) => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query),
        )
      },

      // Persistence
      saveToLocalStorage: () => {
        try {
          const { notes, users, currentUser } = get()
          const dataToSave = {
            notes,
            users,
            currentUser,
            lastSaved: new Date().toISOString(),
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
        } catch (error) {
          console.error('Failed to save to localStorage:', error)
          toast.error('Failed to save data to local storage')
        }
      },

      loadFromLocalStorage: () => {
        try {
          const savedData = localStorage.getItem(STORAGE_KEY)
          if (savedData) {
            const { notes, users, currentUser } = JSON.parse(savedData)
            set(() => ({
              notes: notes || [],
              users: users || MOCK_USERS,
              currentUser: currentUser || MOCK_USERS[0],
            }))
          } else {
            // Initialize with mock data if no saved data
            set(() => ({
              notes: createMockNotes(),
              users: MOCK_USERS,
              currentUser: MOCK_USERS[0],
            }))
            get().saveToLocalStorage()
          }
        } catch (error) {
          console.error('Failed to load from localStorage:', error)
          // Fall back to mock data
          set(() => ({
            notes: createMockNotes(),
            users: MOCK_USERS,
            currentUser: MOCK_USERS[0],
          }))
          toast.error('Failed to load saved data, using default data')
        }
      },

      // Performance optimization
      clearOldOperations: () => {
        const oneHourAgo = dayjs().subtract(1, 'hour').toISOString()
        set((state) => ({
          editOperations: state.editOperations.filter((op) => dayjs(op.timestamp).isAfter(oneHourAgo)),
          conflicts: state.conflicts.filter(
            (conflict) => !conflict.resolvedAt || dayjs(conflict.resolvedAt).isAfter(oneHourAgo),
          ),
        }))
      },
    })),
  )
}

// Singleton store instance
export const notesStore = createNotesStore()

// Setup periodic cleanup
setInterval(() => {
  notesStore.getState().clearOldOperations()
}, CLEANUP_INTERVAL)
