import React, { useMemo, useCallback, useState } from 'react'
import { Box, Container, Typography, Button, Fab, Skeleton, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useNotesStore } from '@/provider/notesProvider'
import { Note } from '@/models/notes'
import NoteCard from '@/components/NoteCard'
import CreateNoteModal from '@/components/CreateNoteModal'
import Header from '@/components/Header'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const notes = useNotesStore((state) => state.getFilteredNotes())
  const searchQuery = useNotesStore((state) => state.searchQuery)
  const users = useNotesStore((state) => state.users)
  const currentUser = useNotesStore((state) => state.currentUser)
  const isLoading = useNotesStore((state) => state.isLoading)

  const setSearchQuery = useNotesStore((state) => state.setSearchQuery)
  const createNote = useNotesStore((state) => state.createNote)
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const duplicateNote = useNotesStore((state) => state.duplicateNote)
  const setCurrentNote = useNotesStore((state) => state.setCurrentNote)

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value)
    },
    [setSearchQuery],
  )

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

  const handleDuplicateNote = useCallback(
    (id: string) => {
      duplicateNote(id)
    },
    [duplicateNote],
  )

  const handleCreateNote = useCallback(
    (title: string, content: string) => {
      createNote(title, content)
    },
    [createNote],
  )

  const notesStats = useMemo(() => {
    const totalNotes = notes.length
    const collaborativeNotes = notes.filter((note) => note.collaborators.length > 1).length
    const recentNotes = notes.filter((note) => dayjs().diff(dayjs(note.updatedAt), 'days') <= 7).length

    return { totalNotes, collaborativeNotes, recentNotes }
  }, [notes])

  if (isLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Box mb={4}>
          <Skeleton variant='text' width={300} height={60} />
          <Skeleton variant='text' width={200} height={30} />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant='rectangular' height={200} />
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onNewNoteClick={() => setCreateDialogOpen(true)}
      />
      <Container maxWidth='lg' sx={{ py: 4, flex: 1, width: '100%' }}>
        <Box mb={4}>
          <Typography variant='h3' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
            My Notes
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            Welcome back, {currentUser?.name}! You have {notesStats.totalNotes} notes
            {notesStats.collaborativeNotes > 0 && `, ${notesStats.collaborativeNotes} collaborative`}
            {notesStats.recentNotes > 0 && `, ${notesStats.recentNotes} updated this week`}.
          </Typography>
        </Box>
        {notes?.length === 0 ? (
          <Box textAlign='center' py={8}>
            {searchQuery ? (
              <Alert severity='info' sx={{ maxWidth: 400, mx: 'auto' }}>
                No notes found matching "{searchQuery}". Try a different search term.
              </Alert>
            ) : (
              <div className='flex flex-row justify-center items-center gap-2'>
                <Typography variant='h5' gutterBottom color='text.secondary'>
                  No notes yet
                </Typography>
                <Typography variant='body1' color='text.secondary' paragraph>
                  Create your first note to get started with collaborative editing!
                </Typography>
                <Button
                  variant='contained'
                  size='large'
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create Your First Note
                </Button>
              </div>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {notes?.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onDuplicate={handleDuplicateNote}
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
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </Fab>

        <CreateNoteModal
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateNote}
        />
      </Container>
    </div>
  )
}
