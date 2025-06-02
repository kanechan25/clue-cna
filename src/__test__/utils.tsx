import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { NotesStoreProvider } from '@/provider/notesProvider'
import { NotesStore } from '@/models/notes'
import { vi } from 'vitest'
import { MOCK_USERS, createMockNotes } from '@/constants/mockData'

const mockTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

export const mockUsers = MOCK_USERS
export const mockNotes = createMockNotes()

const mockToastHoisted = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}))

vi.mock('react-toastify', () => ({
  toast: mockToastHoisted,
  ToastContainer: ({ children }: { children: React.ReactNode }) => <div data-testid='toast-container'>{children}</div>,
}))

export const mockToast = mockToastHoisted

const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={mockTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string
  storeInitialState?: Partial<NotesStore>
}

const customRender = (
  ui: ReactElement,
  { initialRoute = '/', storeInitialState = {}, ...renderOptions }: CustomRenderOptions = {},
) => {
  const defaultState = {
    notes: mockNotes,
    currentNote: null,
    users: mockUsers,
    currentUser: mockUsers[0], // Khoa Tran
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
    ...storeInitialState,
  }

  const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let wrappedChildren = children

    wrappedChildren = <NotesStoreProvider>{wrappedChildren}</NotesStoreProvider>
    wrappedChildren = <MockThemeProvider>{wrappedChildren}</MockThemeProvider>

    if (initialRoute !== '/') {
      window.history.pushState({}, '', initialRoute)
    }
    wrappedChildren = <BrowserRouter>{wrappedChildren}</BrowserRouter>

    return <>{wrappedChildren}</>
  }

  return {
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
    mockStore: defaultState,
  }
}

export * from '@testing-library/react'
export { customRender as render }
