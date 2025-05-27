export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  lastEditedBy: string
  collaborators: string[]
  isDeleted: boolean
  version: number
}

export interface User {
  id: string
  name: string
  color: string
  isActive: boolean
  lastActivity: string
}

export interface EditOperation {
  id: string
  noteId: string
  userId: string
  operation: 'insert' | 'delete' | 'format'
  position: number
  content: string
  timestamp: string
  version: number
}

export interface Conflict {
  id: string
  noteId: string
  operations: EditOperation[]
  resolvedAt?: string
  resolution?: 'manual' | 'auto-merge' | 'latest-wins'
}

export interface NotesState {
  notes: Note[]
  currentNote: Note | null
  users: User[]
  currentUser: User | null
  editOperations: EditOperation[]
  conflicts: Conflict[]
  isLoading: boolean
  searchQuery: string
}

export interface NotesStore extends NotesState {
  createNote: (title: string, content?: string) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setCurrentNote: (note: Note | null) => void
  duplicateNote: (id: string) => void

  addEditOperation: (operation: Omit<EditOperation, 'id' | 'timestamp'>) => void
  checkForConflicts: (operation: EditOperation) => void
  resolveConflict: (conflictId: string, resolution: Conflict['resolution']) => void
  simulateCollaboratorEdit: (noteId: string, content: string) => void

  setCurrentUser: (user: User) => void
  addCollaborator: (noteId: string, userId: string) => void
  removeCollaborator: (noteId: string, userId: string) => void

  setSearchQuery: (query: string) => void
  getFilteredNotes: () => Note[]

  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void

  clearOldOperations: () => void
}

export type FormatType = 'bold' | 'italic' | 'underline' | 'bulletList' | 'numberedList'

export interface RichTextCommand {
  type: FormatType
  isActive: boolean
}
