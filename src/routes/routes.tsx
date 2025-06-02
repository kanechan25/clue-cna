import { Routes } from '@/models/types'
import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Home } from '@/pages/Home'

const NoteEditorPage = lazy(() =>
  import('@/pages/NoteEditorPage').then((module) => ({ default: module.NoteEditorPage })),
)

const LazyPageLoader = () => (
  <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh' flexDirection='column' gap={2}>
    <CircularProgress size={40} />
    <span>Loading ...</span>
  </Box>
)

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
    element: (
      <Suspense fallback={<LazyPageLoader />}>
        <NoteEditorPage />
      </Suspense>
    ),
  },

  // Add other routes as needed
]
