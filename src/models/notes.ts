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

export type ConflictResolution = 'manual' | 'latest-wins'
export interface Conflict {
  id: string
  noteId: string
  operations: EditOperation[]
  resolvedAt?: string
  resolution?: ConflictResolution
}

export interface NotesState {
  notes: Note[]
  currentNote: Note | null
  users: User[]
  currentUser: User | null
  editOperations: EditOperation[]
  conflicts: Conflict[]
  isLoading: boolean
  isLoaded: boolean
  searchQuery: string
}

export interface NotesStore extends NotesState {
  createNote: (title: string, content?: string) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setCurrentNote: (note: Note | null) => void

  addEditOperation: (operation: Omit<EditOperation, 'id' | 'timestamp'>, skipConflictCheck?: boolean) => EditOperation
  checkForConflicts: (operation: EditOperation) => void
  resolveConflict: (conflictId: string, resolution: ConflictResolution) => void
  simulateCollaboratorEdit: (noteId: string, content: string) => void
  simulateMultipleEdits: (noteId: string, baseContent: string) => void

  setCurrentUser: (user: User) => void
  addCollaborator: (noteId: string, userId: string) => void
  removeCollaborator: (noteId: string, userId: string) => void

  setSearchQuery: (query: string) => void
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void

  clearOldOperations: () => void
}
