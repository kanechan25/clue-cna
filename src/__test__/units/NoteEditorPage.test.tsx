import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { NoteEditorPage } from '@/pages/NoteEditorPage'
import { render } from '../utils'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ noteId: 'note-2' }), // Technical skills note
  }
})

// Mock CollaborativeEditor component
vi.mock('@/components/CollaborativeEditor', () => ({
  default: ({ collaborators }: any) => (
    <div data-testid='collaborative-editor'>
      <div>Collaborative Editor</div>
      <div data-testid='active-collaborators'>
        Active collaborators: {collaborators?.map((c: any) => c.name).join(', ')}
      </div>
      <button>Simulate Collaboration</button>
    </div>
  ),
}))

// Mock ConflictModal
vi.mock('@/components/common/ConflictModal', () => ({
  default: () => null,
}))

describe('NoteEditorPage', () => {
  describe('Basic Rendering', () => {
    it('should render the note title "Technical skills"', () => {
      render(<NoteEditorPage />, {
        initialRoute: '/note/note-2',
        storeInitialState: {
          currentNote: {
            id: 'note-2',
            title: 'Technical skills',
            content: 'Note content',
            collaborators: ['user-1', 'user-2', 'user-3'],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T11:00:00.000Z',
            lastEditedBy: 'user-1',
            isDeleted: false,
            version: 1,
          },
        },
      })

      expect(screen.getByDisplayValue('Technical skills')).toBeInTheDocument()
    })

    it('should show "auto saved" status', () => {
      render(<NoteEditorPage />, {
        initialRoute: '/note/note-2',
      })

      expect(screen.getByText('auto saved')).toBeInTheDocument()
    })

    it('should show Active collaborators', () => {
      render(<NoteEditorPage />, {
        initialRoute: '/note/note-2',
      })

      expect(screen.getByTestId('active-collaborators')).toBeInTheDocument()
      expect(screen.getByText(/Active collaborators:/)).toBeInTheDocument()
    })

    it('should show Simulate Collaboration button', () => {
      render(<NoteEditorPage />, {
        initialRoute: '/note/note-2',
      })

      expect(screen.getByText('Simulate Collaboration')).toBeInTheDocument()
    })

    it('should show collaborator management button', () => {
      render(<NoteEditorPage />, {
        initialRoute: '/note/note-2',
      })

      expect(screen.getByLabelText('Manage collaborators')).toBeInTheDocument()
    })
  })
})
