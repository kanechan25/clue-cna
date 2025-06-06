import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { NotesStore, Note, User, EditOperation, Conflict, ConflictResolution } from '@/models/notes'
import { createMockNotes, MOCK_USERS, randomCommentText } from '@/constants/mockData'
import { debouncedSave, clearSelectorsCache } from '@/utils/store'

const STORAGE_KEY = 'collaborative-notes-app'
const CLEANUP_INTERVAL = 60 * 1000 * 2
const MAX_HISTORY = 1000

export const defaultInitState: NotesStore = {
  notes: [],
  currentNote: null,
  users: MOCK_USERS,
  currentUser: MOCK_USERS[0],
  editOperations: [],
  conflicts: [],
  isLoading: false,
  isLoaded: false,
  searchQuery: '',
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  setCurrentNote: () => {},
  addEditOperation: () => ({}) as EditOperation,
  checkForConflicts: () => {},
  resolveConflict: () => {},
  simulateCollaboratorEdit: () => {},
  simulateMultipleEdits: () => {},
  setCurrentUser: () => {},
  addCollaborator: () => {},
  removeCollaborator: () => {},
  setSearchQuery: () => {},
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

        debouncedSave(() => get().saveToLocalStorage())
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

        debouncedSave(() => get().saveToLocalStorage())
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

      // Real-time collaboration
      addEditOperation: (operation: Omit<EditOperation, 'id' | 'timestamp'>, skipConflictCheck?: boolean) => {
        const newOperation: EditOperation = {
          ...operation,
          id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          editOperations: [newOperation, ...state.editOperations.slice(0, MAX_HISTORY - 1)],
        }))

        if (!skipConflictCheck) {
          setTimeout(() => get().checkForConflicts(newOperation), 0)
        }

        return newOperation
      },

      checkForConflicts: (newOperation: EditOperation) => {
        const recentOperations = get().editOperations.filter(
          (op) =>
            op.noteId === newOperation.noteId &&
            op.userId !== newOperation.userId &&
            dayjs(op.timestamp).isAfter(dayjs().subtract(5, 'seconds')),
        )

        if (recentOperations.length > 0) {
          // Check if there's already a conflict for this note that includes these operations
          const existingConflict = get().conflicts.find(
            (conflict) =>
              conflict.noteId === newOperation.noteId &&
              !conflict.resolvedAt &&
              conflict.operations.some((op) => op.userId === newOperation.userId),
          )

          if (existingConflict) {
            // Add to existing conflict
            set((state) => ({
              conflicts: state.conflicts.map((conflict) =>
                conflict.id === existingConflict.id
                  ? { ...conflict, operations: [...conflict.operations, newOperation] }
                  : conflict,
              ),
            }))
          } else {
            // Create new conflict with all related operations
            const allRelatedOperations = [newOperation, ...recentOperations]
            const conflict: Conflict = {
              id: `conflict-${Date.now()}`,
              noteId: newOperation.noteId,
              operations: allRelatedOperations,
            }

            set((state) => ({
              conflicts: [conflict, ...state.conflicts],
            }))
          }
        }
      },

      resolveConflict: (conflictId: string, resolution: ConflictResolution) => {
        set((state) => {
          const conflict = state.conflicts.find((c) => c.id === conflictId)
          if (!conflict) return state

          // Mark conflict as resolved and remove it from active conflicts
          return {
            conflicts: state.conflicts.filter((c) => c.id !== conflictId),
          }
        })

        toast.success(`Conflict resolved using ${resolution} strategy`)
      },

      simulateCollaboratorEdit: (noteId: string, content: string) => {
        const availableUsers = MOCK_USERS.filter((user) => user.id !== get().currentUser?.id)
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]

        if (!randomUser) return

        // Extract just the new comment text that was added
        const currentNote = get().notes.find((n) => n.id === noteId)
        if (!currentNote) return

        // Find the new content that was added (the edit comment)
        const newContentAdded = content.replace(currentNote.content, '').trim()

        get().updateNote(noteId, { content })

        get().addEditOperation({
          noteId,
          userId: randomUser.id,
          operation: 'insert',
          position: content.length,
          content: newContentAdded || content.slice(-100), // Store the actual edit content
          version: get().notes.find((n) => n.id === noteId)?.version || 1,
        })
      },

      simulateMultipleEdits: (noteId: string, baseContent: string) => {
        // TODO: create edit operations from different users
        const availableUsers = MOCK_USERS.filter((user) => user.id !== get().currentUser?.id)
        if (availableUsers.length === 0) return
        const numberOfEdits = 3
        const allOperations: EditOperation[] = []
        let finalContent = baseContent

        for (let i = 0; i < numberOfEdits; i++) {
          setTimeout(() => {
            const randomUser = availableUsers[i % availableUsers.length]
            const randomText = randomCommentText[Math.floor(Math.random() * randomCommentText.length)]
            const timestamp = dayjs().format('DD/MM/YYYY HH:mm:ss')
            const editComment = `<p><em>[${randomUser.name} edited this note at ${timestamp}]: ${randomText}</em></p>`

            const operation = get().addEditOperation(
              {
                noteId,
                userId: randomUser.id,
                operation: 'insert',
                position: baseContent.length + i * 100,
                content: editComment,
                version: get().notes.find((n) => n.id === noteId)?.version || 1,
              },
              true,
            )

            allOperations.push(operation)

            // Update note content with all edits accumulated
            finalContent += editComment
            get().updateNote(noteId, {
              content: finalContent,
            })

            // Only check for conflicts after the last operation
            if (i === numberOfEdits - 1) {
              setTimeout(() => {
                get().checkForConflicts(operation)
              }, 100) // Small delay to ensure all operations are complete
            }
          }, i * 700)
        }
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

      setSearchQuery: (query: string) => {
        set(() => ({ searchQuery: query }))
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
              isLoaded: true,
            }))
          } else {
            // Initialize with mock data if no saved data
            set(() => ({
              notes: createMockNotes(),
              users: MOCK_USERS,
              currentUser: MOCK_USERS[0],
              isLoaded: true,
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
            isLoaded: true,
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

        // Clear selector cache periodically
        clearSelectorsCache()
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
