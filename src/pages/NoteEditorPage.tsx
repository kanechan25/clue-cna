import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useNotesStore } from '@/provider/notesProvider'
import ConflictModal from '@/components/common/ConflictModal'
import CollaborativeEditor from '@/components/CollaborativeEditor'
import { ConflictResolution } from '@/models/notes'
import { cleanEditorContent } from '@/utils'

export const NoteEditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { noteId } = useParams<{ noteId: string }>()

  const [title, setTitle] = useState('')
  const [collaboratorMenuAnchor, setCollaboratorMenuAnchor] = useState<null | HTMLElement>(null)
  const [showConflicts, setShowConflicts] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  const notes = useNotesStore((state) => state.notes)
  const storedCurrentNote = useNotesStore((state) => state.currentNote)
  const users = useNotesStore((state) => state.users)
  const currentUser = useNotesStore((state) => state.currentUser)
  const allConflicts = useNotesStore((state) => state.conflicts)
  const isLoaded = useNotesStore((state) => state.isLoaded)

  const currentNote = useMemo(() => {
    return notes.find((note) => note.id === noteId) || storedCurrentNote
  }, [notes, noteId, storedCurrentNote])

  const conflicts = useMemo(() => {
    return allConflicts.filter((c) => c.noteId === noteId && !c.resolvedAt)
  }, [allConflicts, noteId])

  const updateNote = useNotesStore((state) => state.updateNote)
  const addCollaborator = useNotesStore((state) => state.addCollaborator)
  const removeCollaborator = useNotesStore((state) => state.removeCollaborator)
  const resolveConflict = useNotesStore((state) => state.resolveConflict)
  const addEditOperation = useNotesStore((state) => state.addEditOperation)
  const setCurrentNote = useNotesStore((state) => state.setCurrentNote)

  useEffect(() => {
    if (!isLoaded || !noteId) return // Wait for data to be loaded
    const foundNote = notes.find((note) => note.id === noteId)
    if (foundNote) {
      if (!currentNote || currentNote.id !== noteId) {
        setCurrentNote(foundNote)
      }
      setTitle(foundNote.title)
    } else {
      navigate('/')
    }
  }, [isLoaded, noteId, notes, currentNote, setCurrentNote, navigate])

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
    }
  }, [currentNote])

  useEffect(() => {
    if (conflicts.length > 0) {
      setShowConflicts(true)
    }
  }, [conflicts])

  const collaborators = useMemo(() => {
    if (!currentNote) return []
    return users.filter((user) => currentNote.collaborators.includes(user.id) && user.id !== currentUser?.id)
  }, [currentNote, users, currentUser])

  const availableCollaborators = useMemo(() => {
    if (!currentNote) return []
    return users.filter((user) => !currentNote.collaborators.includes(user.id))
  }, [currentNote, users])

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.target.value
      setTitle(newTitle)

      if (currentNote) {
        updateNote(currentNote.id, { title: newTitle })
      }
    },
    [currentNote, updateNote],
  )

  const handleContentChange = useCallback(
    (content: string) => {
      if (!currentNote) return
      setSaveStatus('saving')
      addEditOperation({
        noteId: currentNote.id,
        userId: currentUser?.id || 'anonymous',
        operation: 'insert',
        position: content.length,
        content: content.slice(-50),
        version: currentNote.version,
      })

      updateNote(currentNote.id, { content })
      setSaveStatus('saved')
    },
    [currentNote, currentUser, addEditOperation, updateNote],
  )

  const handleAddCollaborator = useCallback(
    (userId: string) => {
      if (currentNote) {
        addCollaborator(currentNote.id, userId)
      }
      setCollaboratorMenuAnchor(null)
    },
    [currentNote, addCollaborator],
  )

  const handleRemoveCollaborator = useCallback(
    (userId: string) => {
      if (currentNote) {
        removeCollaborator(currentNote.id, userId)
      }
    },
    [currentNote, removeCollaborator],
  )

  const handleResolveConflict = useCallback(
    (conflictId: string, resolution: string, selectedOperationId?: string) => {
      const conflict = conflicts.find((c) => c.id === conflictId)
      if (!conflict || !currentNote) {
        resolveConflict(conflictId, resolution as ConflictResolution)
        return
      }
      if (!selectedOperationId) return
      const selectedOperation = conflict.operations.find((op) => op.id === selectedOperationId)

      if (selectedOperation) {
        let newContent = currentNote.content

        // Remove all conflicting edit comments
        conflict.operations.forEach(() => {
          const editCommentRegex = new RegExp(`<p><em>\\[.*?edited this note at.*?\\]:.*?</em></p>`, 'g')
          newContent = newContent.replace(editCommentRegex, '')
        })
        // Then add only selected edit
        newContent = newContent + cleanEditorContent(selectedOperation.content)
        // Update the note with resolved content
        updateNote(currentNote.id, { content: newContent })
      }
      resolveConflict(conflictId, resolution as ConflictResolution)
    },
    [conflicts, currentNote, updateNote, resolveConflict],
  )

  if (!isLoaded) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
        <Typography variant='h6' color='text.secondary'>
          Loading...
        </Typography>
      </Box>
    )
  }

  if (!currentNote) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
        <Typography variant='h6' color='text.secondary'>
          Note not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      <AppBar position='sticky' color='inherit' elevation={1}>
        <Toolbar>
          <IconButton edge='start' onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>

          <TextField
            value={title}
            onChange={handleTitleChange}
            placeholder='Note title...'
            variant='standard'
            sx={{
              flexGrow: 1,
              mr: 2,
              '& .MuiInput-root': {
                fontSize: '1.25rem',
                fontWeight: 500,
              },
            }}
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
          />

          <Box display='flex' alignItems='center' gap={1}>
            <Chip
              size='small'
              label={saveStatus === 'saved' ? 'auto saved' : saveStatus}
              color={saveStatus === 'saved' ? 'success' : saveStatus === 'saving' ? 'default' : 'error'}
              variant='outlined'
            />

            <Tooltip title='Manage collaborators'>
              <IconButton onClick={(e) => setCollaboratorMenuAnchor(e.currentTarget)}>
                <PeopleIcon />
              </IconButton>
            </Tooltip>

            {/* Conflicts indicator */}
            {conflicts?.length > 0 && (
              <Tooltip title={`${conflicts.length} conflicts`}>
                <IconButton onClick={() => setShowConflicts(true)} color='warning'>
                  <WarningIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={`Version ${currentNote.version} • Updated ${dayjs(currentNote.updatedAt).fromNow()}`}>
              <IconButton>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <CollaborativeEditor note={currentNote} onContentChange={handleContentChange} collaborators={collaborators} />
      </Container>

      {/* Collaborator Menu */}
      <Menu
        anchorEl={collaboratorMenuAnchor}
        open={Boolean(collaboratorMenuAnchor)}
        onClose={() => setCollaboratorMenuAnchor(null)}
      >
        {collaborators?.length > 0 && (
          <MenuItem disabled>
            <Typography variant='subtitle2'>Current Collaborators</Typography>
          </MenuItem>
        )}
        {collaborators?.map((collaborator) => (
          <MenuItem key={collaborator.id}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: collaborator.color, width: 32, height: 32 }}>{collaborator.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={collaborator.name} />
            <Button size='small' onClick={() => handleRemoveCollaborator(collaborator.id)}>
              Remove
            </Button>
          </MenuItem>
        ))}

        {availableCollaborators?.length > 0 && (
          <div>
            <MenuItem disabled>
              <Typography variant='subtitle2'>Add Collaborators</Typography>
            </MenuItem>
            {availableCollaborators.map((user) => (
              <MenuItem key={user.id} onClick={() => handleAddCollaborator(user.id)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: user.color, width: 32, height: 32 }}>{user.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <PersonAddIcon fontSize='small' />
              </MenuItem>
            ))}
          </div>
        )}
      </Menu>

      <ConflictModal
        open={showConflicts}
        conflicts={conflicts}
        onResolve={handleResolveConflict}
        onClose={() => setShowConflicts(false)}
      />
    </Box>
  )
}
