import React, { useMemo, useCallback, useState } from 'react'
import { Box, Container, Typography, Button, Fab, Skeleton, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useNotesStore } from '@/provider/notesProvider'
import { Note } from '@/models/notes'
import NoteCard from '@/components/NoteCard'
import CreateNoteModal from '@/components/CreateNoteModal'
import Header from '@/components/Header'

const GRID_STYLES = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
  },
  gap: 3,
}

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Get raw data from store - these selectors return stable references
  const allNotes = useNotesStore((state) => state.notes)
  const searchQuery = useNotesStore((state) => state.searchQuery)
  const users = useNotesStore((state) => state.users)
  const currentUser = useNotesStore((state) => state.currentUser)
  const isLoading = useNotesStore((state) => state.isLoading)

  // Filter notes in component with memoization - prevents infinite loops
  const notes = useMemo(() => {
    if (!searchQuery.trim()) {
      return allNotes
    }

    const query = searchQuery.toLowerCase()
    return allNotes.filter(
      (note) => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query),
    )
  }, [allNotes, searchQuery])

  // Store actions - already stable references
  const setSearchQuery = useNotesStore((state) => state.setSearchQuery)
  const createNote = useNotesStore((state) => state.createNote)
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const setCurrentNote = useNotesStore((state) => state.setCurrentNote)

  // Only memoize handlers passed to React.memo child components (NoteCard)
  const handleEditNote = useCallback(
    (note: Note) => {
      setCurrentNote(note)
      navigate(`/note/${note.id}`)
    },
    [setCurrentNote, navigate],
  )

  const handleDeleteNote = useCallback(
    (id: string) => {
      deleteNote(id)
    },
    [deleteNote],
  )

  const handleShareNote = useCallback(
    async (id: string) => {
      const note = notes.find((n) => n.id === id)
      if (!note) return

      try {
        const shareableLink = `${window.location.origin}/note/${id}`
        await navigator.clipboard.writeText(shareableLink)
        toast.success(`Link copied to clipboard! Let's share "${note.title}" with others.`)
      } catch {
        toast.error(`Failed to share link!`)
      }
    },
    [notes],
  )

  // Simple search handler - no complex debouncing needed
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value)
    },
    [setSearchQuery],
  )

  const handleCreateNote = (title: string, content: string) => {
    createNote(title, content)
  }

  const handleOpenCreateDialog = () => setCreateDialogOpen(true)
  const handleCloseCreateDialog = () => setCreateDialogOpen(false)

  // Only memoize expensive calculations
  const notesStats = useMemo(() => {
    const totalNotes = notes.length
    const collaborativeNotes = notes.filter((note) => note.collaborators.length > 1).length
    const recentNotes = notes.filter((note) => dayjs().diff(dayjs(note.updatedAt), 'days') <= 7).length

    return { totalNotes, collaborativeNotes, recentNotes }
  }, [notes])

  // Simple string building - no memoization needed
  const { totalNotes, collaborativeNotes, recentNotes } = notesStats
  let welcomeMessage = `Welcome back, ${currentUser?.name}! You have ${totalNotes} notes`

  if (collaborativeNotes > 0) {
    welcomeMessage += `, ${collaborativeNotes} collaborative`
  }

  if (recentNotes > 0) {
    welcomeMessage += `, ${recentNotes} updated this week.`
  }

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Box mb={4}>
          <Skeleton variant='text' width={300} height={60} />
          <Skeleton variant='text' width={200} height={30} />
        </Box>
        <Box sx={GRID_STYLES}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant='rectangular' height={200} />
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} onNewNoteClick={handleOpenCreateDialog} />
      <Container maxWidth='lg' sx={{ py: 4, flex: 1, width: '100%' }}>
        <Box mb={4}>
          <Typography variant='h3' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
            My Notes
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
            {welcomeMessage}
          </Typography>
        </Box>

        {notes?.length === 0 ? (
          <Box textAlign='center' py={8}>
            {searchQuery ? (
              <Alert severity='info' sx={{ maxWidth: 400, mx: 'auto' }}>
                No notes found matching "{searchQuery}". Try a different search term.
              </Alert>
            ) : (
              <div className='flex flex-col justify-center items-center gap-2'>
                <Typography variant='h5' gutterBottom color='text.secondary'>
                  No notes yet
                </Typography>
                <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
                  Create your first note to get started with collaborative editing!
                </Typography>
                <Button variant='contained' size='large' startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
                  Create Your First Note
                </Button>
              </div>
            )}
          </Box>
        ) : (
          <Box sx={GRID_STYLES}>
            {notes?.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onShare={handleShareNote}
                users={users}
              />
            ))}
          </Box>
        )}

        <Fab
          color='primary'
          aria-label='add note'
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' },
          }}
          onClick={handleOpenCreateDialog}
        >
          <AddIcon />
        </Fab>

        <CreateNoteModal open={createDialogOpen} onClose={handleCloseCreateDialog} onSubmit={handleCreateNote} />
      </Container>
    </div>
  )
}
