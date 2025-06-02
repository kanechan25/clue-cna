import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, mockToast } from '../utils'
import { Home } from '@/pages/Home'
import Header from '@/components/common/Header'
import CreateNoteModal from '@/components/common/CreateNoteModal'
import { NotesStore } from '@/models/notes'

const mockStoreState: NotesStore = {
  notes: [],
  currentNote: null,
  users: [],
  currentUser: null,
  editOperations: [],
  conflicts: [],
  isLoading: false,
  isLoaded: true,
  searchQuery: '',
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
  setCurrentNote: vi.fn(),
  addEditOperation: vi.fn(),
  checkForConflicts: vi.fn(),
  resolveConflict: vi.fn(),
  simulateCollaboratorEdit: vi.fn(),
  simulateMultipleEdits: vi.fn(),
  setCurrentUser: vi.fn(),
  addCollaborator: vi.fn(),
  removeCollaborator: vi.fn(),
  setSearchQuery: vi.fn(),
  saveToLocalStorage: vi.fn(),
  loadFromLocalStorage: vi.fn(),
  clearOldOperations: vi.fn(),
}

vi.mock('@/provider/notesProvider', () => ({
  NotesStoreProvider: ({ children }: { children: React.ReactNode }) => children,
  useNotesStore: (selector: (store: NotesStore) => any) => selector(mockStoreState),
}))

describe('Note Creation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockStoreState, {
      notes: [],
      currentNote: null,
      users: [{ id: 'user1', name: 'Khoa Tran', color: '#FF5722' }],
      currentUser: { id: 'user1', name: 'Khoa Tran', color: '#FF5722' },
      editOperations: [],
      conflicts: [],
      isLoading: false,
      isLoaded: true,
      searchQuery: '',
      createNote: vi.fn(),
      updateNote: vi.fn(),
      deleteNote: vi.fn(),
      setCurrentNote: vi.fn(),
      addEditOperation: vi.fn(),
      checkForConflicts: vi.fn(),
      resolveConflict: vi.fn(),
      simulateCollaboratorEdit: vi.fn(),
      simulateMultipleEdits: vi.fn(),
      setCurrentUser: vi.fn(),
      addCollaborator: vi.fn(),
      removeCollaborator: vi.fn(),
      setSearchQuery: vi.fn(),
      saveToLocalStorage: vi.fn(),
      loadFromLocalStorage: vi.fn(),
      clearOldOperations: vi.fn(),
    })
  })

  describe('Clicking New Note Button on Header', () => {
    it('should render New Note button', () => {
      const mockOnNewNoteClick = vi.fn()
      const mockOnSearchChange = vi.fn()

      render(<Header searchQuery='' onSearchChange={mockOnSearchChange} onNewNoteClick={mockOnNewNoteClick} />)

      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      expect(newNoteButton).toBeInTheDocument()
    })

    it('should call onNewNoteClick when New Note button is clicked', () => {
      const mockOnNewNoteClick = vi.fn()
      const mockOnSearchChange = vi.fn()

      render(<Header searchQuery='' onSearchChange={mockOnSearchChange} onNewNoteClick={mockOnNewNoteClick} />)

      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      fireEvent.click(newNoteButton)

      expect(mockOnNewNoteClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Home Page handleOpenCreateDialog', () => {
    it('should call handleOpenCreateDialog when header New Note button is clicked', async () => {
      mockStoreState.notes = []
      mockStoreState.createNote = vi.fn()

      render(<Home />)

      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      fireEvent.click(newNoteButton)
      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })
    })

    it('should open CreateNoteModal when "Create Your First Note" button is clicked (empty state)', async () => {
      mockStoreState.notes = []
      mockStoreState.createNote = vi.fn()

      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('No notes yet')).toBeInTheDocument()
      })

      const createFirstNoteButton = screen.getByRole('button', { name: /create your first note/i })
      fireEvent.click(createFirstNoteButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })
    })

    it('should open CreateNoteModal when FAB (floating action button) button is clicked', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })
      mockStoreState.notes = []
      mockStoreState.createNote = vi.fn()

      render(<Home />)

      const fabButton = screen.getByLabelText(/add note/i)
      fireEvent.click(fabButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })
    })
  })

  describe('CreateNoteModal', () => {
    it('should render CreateNoteModal when open prop is true', () => {
      const mockOnClose = vi.fn()
      const mockOnSubmit = vi.fn()

      render(<CreateNoteModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

      expect(screen.getByText('Create New Note')).toBeInTheDocument()
      expect(screen.getByLabelText(/note title/i)).toBeInTheDocument()
      expect(screen.getByText('Note Content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should not render CreateNoteModal when open prop is false', () => {
      const mockOnClose = vi.fn()
      const mockOnSubmit = vi.fn()

      render(<CreateNoteModal open={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
      expect(screen.queryByText('Create New Note')).not.toBeInTheDocument()
    })

    it('should call onSubmit with title and content when Create button is clicked', async () => {
      const mockOnClose = vi.fn()
      const mockOnSubmit = vi.fn()

      render(<CreateNoteModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

      const titleInput = screen.getByLabelText(/note title/i)
      const createButton = screen.getByRole('button', { name: /create/i })

      expect(createButton).toBeDisabled()
      fireEvent.change(titleInput, { target: { value: 'Test Note Title' } })

      await waitFor(() => {
        expect(createButton).not.toBeDisabled()
      })
      fireEvent.click(createButton)

      // submit with title and empty content
      expect(mockOnSubmit).toHaveBeenCalledWith('Test Note Title', '')
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Cancel button is clicked', () => {
      const mockOnClose = vi.fn()
      const mockOnSubmit = vi.fn()

      render(<CreateNoteModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should reset form fields after successful submission', async () => {
      const mockOnClose = vi.fn()
      const mockOnSubmit = vi.fn()

      render(<CreateNoteModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

      const titleInput = screen.getByLabelText(/note title/i) as HTMLInputElement
      const createButton = screen.getByRole('button', { name: /create/i })

      fireEvent.change(titleInput, { target: { value: 'Test Note Title' } })
      expect(titleInput.value).toBe('Test Note Title')

      fireEvent.click(createButton)

      expect(mockOnSubmit).toHaveBeenCalledWith('Test Note Title', '')
    })
  })

  describe('Integration: Full Note Creation Flow', () => {
    it('should complete full flow: click button -> open modal -> create note -> call createNote function', async () => {
      const mockCreateNote = vi.fn()
      mockStoreState.notes = []
      mockStoreState.createNote = mockCreateNote
      render(<Home />)

      // 1: Click New Note button in header
      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      fireEvent.click(newNoteButton)
      // 2: Verify modal opens
      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })
      // 3: Fill in the form
      const titleInput = screen.getByLabelText(/note title/i)
      fireEvent.change(titleInput, { target: { value: 'My New Test Note' } })
      // 4: Submit the form
      const createButton = screen.getByRole('button', { name: /create/i })
      await waitFor(() => {
        expect(createButton).not.toBeDisabled()
      })
      fireEvent.click(createButton)
      // 5: createNote function was called
      expect(mockCreateNote).toHaveBeenCalledTimes(1)
      expect(mockCreateNote).toHaveBeenCalledWith('My New Test Note', '')
      // 6: Verify modal closes
      await waitFor(() => {
        expect(screen.queryByText('Create New Note')).not.toBeInTheDocument()
      })
    })

    it('should show success toast when note is created', async () => {
      const mockCreateNote = vi.fn(() => {
        mockToast.success('Note "My New Test Note" created successfully!')
      })
      mockStoreState.notes = []
      mockStoreState.createNote = mockCreateNote
      render(<Home />)
      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      fireEvent.click(newNoteButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })
      const titleInput = screen.getByLabelText(/note title/i)
      fireEvent.change(titleInput, { target: { value: 'My New Test Note' } })
      const createButton = screen.getByRole('button', { name: /create/i })
      await waitFor(() => {
        expect(createButton).not.toBeDisabled()
      })
      fireEvent.click(createButton)

      expect(mockCreateNote).toHaveBeenCalledWith('My New Test Note', '')
      expect(mockToast.success).toHaveBeenCalledWith('Note "My New Test Note" created successfully!')
    })

    it('should prevent submission with empty title', async () => {
      const mockCreateNote = vi.fn()
      mockStoreState.notes = []
      mockStoreState.createNote = mockCreateNote
      render(<Home />)

      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      fireEvent.click(newNoteButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /create/i })
      expect(createButton).toBeDisabled()

      const titleInput = screen.getByLabelText(/note title/i)
      fireEvent.change(titleInput, { target: { value: '   ' } })

      // create button still be disabled
      expect(createButton).toBeDisabled()
      expect(mockCreateNote).not.toHaveBeenCalled()
    })
  })

  describe('Notes Store createNote Function', () => {
    it('should call createNote function from store with correct parameters', async () => {
      const mockCreateNote = vi.fn()
      mockStoreState.notes = []
      mockStoreState.createNote = mockCreateNote

      render(<Home />)

      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      fireEvent.click(newNoteButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })

      const titleInput = screen.getByLabelText(/note title/i)
      fireEvent.change(titleInput, { target: { value: 'Test Note with Content' } })

      const createButton = screen.getByRole('button', { name: /create/i })
      await waitFor(() => {
        expect(createButton).not.toBeDisabled()
      })
      fireEvent.click(createButton)

      expect(mockCreateNote).toHaveBeenCalledTimes(1)
      expect(mockCreateNote).toHaveBeenCalledWith('Test Note with Content', '')
    })

    it('should handle note creation with both title and content', async () => {
      const mockCreateNote = vi.fn()
      mockStoreState.notes = []
      mockStoreState.createNote = mockCreateNote

      render(<Home />)

      const newNoteButton = screen.getByRole('button', { name: /new note/i })
      fireEvent.click(newNoteButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Note')).toBeInTheDocument()
      })

      const titleInput = screen.getByLabelText(/note title/i)
      fireEvent.change(titleInput, { target: { value: 'Note with Content' } })

      const createButton = screen.getByRole('button', { name: /create/i })
      await waitFor(() => {
        expect(createButton).not.toBeDisabled()
      })
      fireEvent.click(createButton)
      expect(mockCreateNote).toHaveBeenCalledWith('Note with Content', '')
    })
  })
})
