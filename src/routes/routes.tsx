import { Routes } from '@/models/types'
import { Home } from '@/pages/Home'
import { NoteEditorPage } from '@/pages/NoteEditorPage'

export const routers: Routes[] = [
  {
    href: '/',
    id: 'home',
    name: 'Notes Home',
    element: <Home />,
  },
  {
    href: '/note/:noteId',
    id: 'note-editor',
    name: 'Note Editor',
    element: <NoteEditorPage />,
  },

  // Add other routes as needed
]
